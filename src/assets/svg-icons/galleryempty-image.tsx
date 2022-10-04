import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={82}
    height={68}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m75.247 59.13-.119-.047.13-51.223.001-.31-.217-.219-.007-.008-.025-.027L75 7.282l-.07-.078a1.694 1.694 0 0 0-.3-.27l-.19-.128H7.44l-.22.223-.298.302-.216.22v53.643H74.56l.22-.223c.129-.13.178-.278.184-.294a1.25 1.25 0 0 0 .04-.132c.017-.069.031-.146.043-.216.024-.138.048-.309.07-.468l.129-.73ZM36.693 47.736l.6.733.575-.752 12.44-16.247 15.295 20.67H16.43l11.544-15.043 8.719 10.64ZM7.455.75h67.09c1.617 0 3.298.827 4.592 2.138 1.293 1.31 2.113 3.019 2.113 4.668v52.888c0 1.649-.82 3.358-2.113 4.668-1.294 1.311-2.975 2.138-4.591 2.138H7.455C3.778 67.25.75 64.195.75 60.444V7.556c0-1.649.82-3.358 2.113-4.668C4.157 1.577 5.838.75 7.455.75Z"
      fill="#355D9B"
      stroke="#FDFCFD"
      strokeWidth={1.5}
    />
  </Svg>
)

export default SvgComponent
