/** Statische Schnittzeichnung, wenn kein WebGL läuft oder Bewegung reduziert ist. */
export function JacketDiagram() {
  return (
    <svg
      className="valve-diagram"
      viewBox="0 0 420 320"
      role="img"
      aria-label="Schnitt durch ein Dämmkissen: Aussenhülle, Dämmkern, Innenhülle und Bauteil"
    >
      <g fill="none" strokeWidth="1.5">
        <circle cx="210" cy="170" r="112" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="92" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="72" stroke="var(--edge-strong)" />
        <circle cx="210" cy="170" r="52" fill="var(--ink)" stroke="none" />
        <path
          d="M210 58v-34M210 316v-30M98 170H62M358 170h-38"
          stroke="var(--edge-strong)"
        />
      </g>
      <g
        fill="var(--ink-faint)"
        fontFamily="var(--font-display)"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.4"
      >
        <text x="210" y="18" textAnchor="middle">
          01 AUSSENHÜLLE
        </text>
        <text x="18" y="174">
          02 KERN
        </text>
        <text x="402" y="174" textAnchor="end">
          03 INNENHÜLLE
        </text>
        <text x="210" y="308" textAnchor="middle">
          BAUTEIL
        </text>
      </g>
    </svg>
  )
}
