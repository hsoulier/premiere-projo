import type { ComponentProps, SVGProps } from "react"

export const UGCIcon = (props: ComponentProps<"svg">) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="19"
      y="55"
      width="218"
      height="146"
      fill="url(#pattern0_1552_5)"
      style={{ mixBlendMode: "exclusion" }}
    />
    <defs>
      <pattern
        id="pattern0_1552_5"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_1552_5"
          transform="matrix(0.00169492 0 0 0.00253076 0 -0.00109125)"
        />
      </pattern>
      <image
        id="image0_1552_5"
        width="590"
        height="396"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
)
