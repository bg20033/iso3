from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "IsoMat"
PUBLIC = ROOT / "public"
MEDIA = PUBLIC / "media"

CATEGORIES = {
    "ventile-armaturen": "1_Ventile",
    "heizungszentralen": "2_Heizungszentralen",
    "ascheaustragssysteme": "3_Ascheaustragssysteme",
    "revisionstueren": "4_T",
    "kompensatoren": "5_Kompensatoren",
    "turbinen": "Turbinen",
    "sonderbau": "Sonderbau",
}

ALT_LABELS = {
    "ventile-armaturen": "Massgefertigte Ventil- und Armaturenisolierung",
    "heizungszentralen": "Dämmkissen in einer Heizungszentrale",
    "ascheaustragssysteme": "Isolierung an einem Ascheaustragssystem",
    "revisionstueren": "Abnehmbare Isolierung einer Revisionstür",
    "kompensatoren": "Dämmkissen an einem Kompensator",
    "turbinen": "Modulare Turbinenisolierung",
    "sonderbau": "Individuelle Sonderisolierung",
}

FEATURED_HINTS = {
    "ventile-armaturen": ["15.png", "1_1.jpeg", "1_1.png"],
    "heizungszentralen": ["1_1.JPG", "2_1.jpg"],
    "ascheaustragssysteme": ["1_1.jpg", "2_2.JPG"],
    "revisionstueren": ["1.jpg", "3.jpg"],
    "kompensatoren": ["1_1.png", "2016-03-15 16.59.36.jpg"],
    "turbinen": ["IMG_4189.JPG", "Turbine1_2.JPG.JPG"],
    "sonderbau": ["1.jpg", "20171201_130327.jpg"],
}


def folded(value: str) -> str:
    return unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()


def category_folder(prefix: str) -> Path:
    for folder in SOURCE.iterdir():
        if folder.is_dir() and folded(folder.name).startswith(folded(prefix)):
            return folder
    raise FileNotFoundError(prefix)


def image_files(slug: str, folder: Path) -> list[Path]:
    candidates: list[Path] = []
    for path in folder.rglob("*"):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        relative = path.relative_to(folder)
        if slug == "turbinen" and len(relative.parts) > 1:
            continue
        if path.name.startswith("ChatGPT Image"):
            continue
        candidates.append(path)

    hints = FEATURED_HINTS[slug]
    candidates.sort(
        key=lambda path: (
            next((i for i, hint in enumerate(hints) if path.name == hint), 999),
            folded(path.name),
        )
    )
    return candidates


def fingerprint(image: Image.Image) -> str:
    sample = ImageOps.fit(image.convert("RGB"), (64, 64), method=Image.Resampling.LANCZOS)
    return hashlib.sha256(sample.tobytes()).hexdigest()


def save_webp(image: Image.Image, path: Path, width: int, quality: int) -> tuple[int, int]:
    resized = image.copy()
    if resized.width > width:
        height = round(resized.height * width / resized.width)
        resized = resized.resize((width, height), Image.Resampling.LANCZOS)
    resized.save(path, "WEBP", quality=quality, method=6)
    return resized.size


def prepare_logo() -> None:
    candidates = sorted(Path("/tmp").glob("isomat-assets.*/pdf-000.png"))
    if not candidates:
        return
    image = Image.open(candidates[-1]).convert("RGBA")
    pixels = []
    for red, green, blue, _ in image.getdata():
        darkest = min(red, green, blue)
        alpha = 0 if darkest >= 224 else max(0, min(255, (224 - darkest) * 7))
        pixels.append((red, green, blue, alpha))
    image.putdata(pixels)
    image.resize((244, 204), Image.Resampling.LANCZOS).save(PUBLIC / "logo.png")


def prepare_hero() -> None:
    source = SOURCE / "ChatGPT Image 4. Juli 2026, 11_09_02.png"
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    save_webp(image, PUBLIC / "hero-industrial.webp", 1800, 84)


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, list[dict[str, object]]] = {}

    for slug, prefix in CATEGORIES.items():
        folder = category_folder(prefix)
        target = MEDIA / slug
        target.mkdir(parents=True, exist_ok=True)
        seen: set[str] = set()
        items: list[dict[str, object]] = []

        for source in image_files(slug, folder):
            try:
                image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
            except (OSError, ValueError):
                continue
            digest = fingerprint(image)
            if digest in seen:
                continue
            seen.add(digest)

            number = len(items) + 1
            stem = f"{number:02d}"
            thumb = target / f"{stem}-480.webp"
            large = target / f"{stem}-1280.webp"
            save_webp(image, thumb, 480, 76)
            width, height = save_webp(image, large, 1280, 82)
            items.append(
                {
                    "src": f"/media/{slug}/{large.name}",
                    "thumb": f"/media/{slug}/{thumb.name}",
                    "alt": f"{ALT_LABELS[slug]} – Referenz {number:02d}",
                    "width": width,
                    "height": height,
                }
            )
        manifest[slug] = items

    prepare_logo()
    prepare_hero()

    output = ROOT / "src" / "data" / "media.generated.ts"
    output.write_text(
        "/* Generated by scripts/prepare_media.py. */\n"
        f"export const mediaBySlug = {json.dumps(manifest, ensure_ascii=False, indent=2)} as const\n",
        encoding="utf-8",
    )
    count = sum(len(items) for items in manifest.values())
    print(f"Prepared {count} unique gallery images in {MEDIA}")


if __name__ == "__main__":
    main()
