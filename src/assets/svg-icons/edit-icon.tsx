import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={21}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.5 11.76v-.003a.5.5 0 01.144-.354h.001l6.938-6.93h.001l2.82-2.83h.001a.5.5 0 01.71-.001s0 0 0 0l4.24 4.29h0l.003.003a.498.498 0 010 .71s0 0 0 0L16.52 9.423h0l-.004.004-6.918 6.928s0 0 0 0a.5.5 0 01-.355.145v0H5a.5.5 0 01-.5-.5v-4.24zm10.614-8.704l-.354-.353-.354.353-1.42 1.42-.353.354.353.354 2.83 2.83.354.353.354-.353 1.42-1.42.353-.354-.353-.354-2.83-2.83zm-9.468 8.76l-.146.147V15.5h3.537l.147-.146 5.93-5.93.353-.354-.353-.354-2.83-2.83-.354-.353-.354.353-5.93 5.93zm13-.17A.5.5 0 0119.5 12v6a2.5 2.5 0 01-2.5 2.5H3A2.5 2.5 0 01.5 18V4A2.5 2.5 0 013 1.5h6a.5.5 0 010 1H3A1.5 1.5 0 001.5 4v14A1.5 1.5 0 003 19.5h14a1.5 1.5 0 001.5-1.5v-6a.5.5 0 01.146-.354z"
        fill="#000"
        stroke={props.stroke ? props?.stroke : "#355D9B"}
      />
    </Svg>
  )
}

export default SvgComponent
