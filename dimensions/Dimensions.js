import { Dimensions } from 'react-native';
import { Platform } from 'react-native';

// based on figma design
const stdWidth = 430;
const stdHeight = 932;

const deviceWidth = (Platform.OS == 'web') ? stdWidth : Dimensions.get("window").width;
const deviceHeight = (Platform.OS == 'web') ? (stdHeight-200) : Dimensions.get("window").height;

const resizeWidth = width => width * deviceWidth / stdWidth;
const resizeHeight = height => height * deviceHeight / stdHeight;

export { resizeWidth, resizeHeight }