import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={16}
      height={13}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.4 0H1.6C.72 0 .008.72.008 1.6L0 11.2c0 .88.72 1.6 1.6 1.6h12.8c.88 0 1.6-.72 1.6-1.6V1.6c0-.88-.72-1.6-1.6-1.6zm0 3.2L8 7.2l-6.4-4V1.6l6.4 4 6.4-4v1.6z"
        fill="#00ADEF"
      />
    </Svg>
  )
}

export default SvgComponent
