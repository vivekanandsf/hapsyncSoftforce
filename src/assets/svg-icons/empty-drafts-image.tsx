import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={59}
    height={83}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M25.814 56.36c0-1.41.375-2.64 1.125-3.69.75-1.08 1.86-2.31 3.33-3.69 1.44-1.35 2.52-2.52 3.24-3.51.72-1.02 1.08-2.19 1.08-3.51 0-1.77-.585-3.135-1.755-4.095s-2.7-1.44-4.59-1.44c-1.56 0-2.835.33-3.825.99-.99.66-1.71 1.485-2.16 2.475-.42.99-.63 1.995-.63 3.015v.18h-3.915v-.18c0-1.95.42-3.69 1.26-5.22.87-1.53 2.1-2.73 3.69-3.6 1.59-.87 3.45-1.305 5.58-1.305 2.07 0 3.87.39 5.4 1.17 1.56.78 2.76 1.86 3.6 3.24.84 1.35 1.26 2.88 1.26 4.59 0 1.23-.24 2.355-.72 3.375a9.614 9.614 0 0 1-1.71 2.655c-.66.75-1.53 1.635-2.61 2.655-1.29 1.2-2.25 2.22-2.88 3.06a4.607 4.607 0 0 0-.945 2.835v.36h-3.825v-.36Zm1.935 9.045c-.72 0-1.32-.24-1.8-.72-.45-.48-.675-1.08-.675-1.8 0-.69.225-1.275.675-1.755.48-.48 1.08-.72 1.8-.72.69 0 1.275.24 1.755.72s.72 1.065.72 1.755-.24 1.29-.72 1.8c-.48.48-1.065.72-1.755.72Z"
      fill="#355D9B"
    />
    <Path
      d="M58.316 18.472 43.27.958A2.732 2.732 0 0 0 41.196 0H3.19C1.428 0 0 1.457 0 3.255v76.49C0 81.543 1.428 83 3.19 83h52.62c1.762 0 3.19-1.457 3.19-3.255V20.327c0-.683-.243-1.342-.684-1.855ZM3.19 79.877V3.255h36.942v16.653c0 .898.713 1.627 1.595 1.627H55.81l.001 58.342H3.19Z"
      fill="#355D9B"
    />
  </Svg>
)

export default SvgComponent