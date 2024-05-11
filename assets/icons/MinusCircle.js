import Svg, { Path } from "react-native-svg"

const MinusCircle = (props) => {
  return (<Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.style.size}
    height={props.style.size}
    viewBox="0 0 20 20"
    fill="none"
    preserveAspectRatio="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10c-.006 5.52-4.48 9.994-10 10Zm-8-9.828A8 8 0 1 0 2 10v.172ZM15 11H5V9h10v2Z"
    />
    <Path
      d="M9.443 18.053c-1.894-.157-3.636-.935-4.975-2.22a8.076 8.076 0 0 1-2.405-4.894 10.662 10.662 0 0 1 0-1.709 8.006 8.006 0 0 1 4.403-6.29 7.856 7.856 0 0 1 4.927-.71c2.9.503 5.323 2.632 6.22 5.463a8.068 8.068 0 0 1 0 4.783 7.966 7.966 0 0 1-4.116 4.773 7.907 7.907 0 0 1-2.382.74c-.352.053-1.349.09-1.672.064zM15 10V8.986H5v2.028h10z"
      style={{
        fill: "#fff",
        strokeWidth: 0.033837,
      }}
    />
  </Svg>
  );
}

export default MinusCircle;