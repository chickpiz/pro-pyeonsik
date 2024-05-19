import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ChevronLeft = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.style.width}
    height={props.style.height}
    fill="none"
    viewBox="0 0 15 25"
    {...props}
  >
    <Path
      fill="#2E3A59"
      d="M12.655.126.281 12.5l12.374 12.374 2.064-2.062L4.405 12.5 14.72 2.188 12.655.126Z"
    />
  </Svg>
)
export default ChevronLeft
