import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 17H9v-2h2v2zm2.07-7.75l-.9.92C11.45 10.9 11 11.5 11 13H9v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
        fill="url(#prefix__paint0_radial)"
      />
      <Defs>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 25 -25 0 17.083 0)"
        >
          <Stop stopColor="#85D3FF" />
          <Stop offset={1} stopColor="#2596D7" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}

export default SvgComponent
