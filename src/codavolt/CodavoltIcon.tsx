// @ts-nocheck -- ported as-is from the original Codavolt build
export function CodavoltIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path
        d="M23 17H16V28H11V36H16V47H23"
        stroke="#fb923c"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 17H48V28H53V36H48V47H41"
        stroke="#f59e0b"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37 10L24 30H33L27 54L43 26H34L37 10Z"
        fill="url(#codaBoltGrad)"
      />
      <defs>
        <linearGradient id="codaBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CodavoltIcon;
