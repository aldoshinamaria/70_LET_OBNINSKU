interface MaLogoProps {
  className?: string;
}

/**
 * Адаптация логотипа MA.digital под палитру проекта: круглый герб «MA. / digital»
 * в золоте на прозрачном фоне. Без чёрной подложки — гармонично ложится на тёмный
 * фон сайта и остаётся чётким на любом размере (векторный SVG).
 */
export function MaLogo({ className }: MaLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="MA.digital"
    >
      <defs>
        <linearGradient id="ma-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EBD2A0" />
          <stop offset="1" stopColor="#C9A24F" />
        </linearGradient>
        <linearGradient id="ma-text" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF4E4" />
          <stop offset="1" stopColor="#E3C485" />
        </linearGradient>
      </defs>

      {/* Внешнее кольцо (отсылка к неоновому кругу оригинала) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="url(#ma-ring)"
        strokeWidth="2.4"
        opacity="0.95"
      />
      <circle
        cx="50"
        cy="50"
        r="42.5"
        fill="none"
        stroke="#D9B36C"
        strokeWidth="0.6"
        opacity="0.3"
      />

      {/* Вордмарк */}
      <text
        x="50"
        y="49"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Manrope, sans-serif"
        fontWeight="800"
        fontSize="29"
        letterSpacing="-1"
        fill="url(#ma-text)"
      >
        MA.
      </text>
      <text
        x="50"
        y="68"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Manrope, sans-serif"
        fontWeight="500"
        fontSize="11"
        letterSpacing="2.5"
        fill="#D9B36C"
      >
        digital
      </text>
    </svg>
  );
}
