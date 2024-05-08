import { Dimensions } from 'react-native';

// based on figma design
const stdWidth = 430;
const stdHeight = 932;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const resizeWidth = width => width * deviceWidth / stdWidth;
const resizeHeight = height => height * deviceHeight / stdHeight;

export { resizeWidth, resizeHeight }