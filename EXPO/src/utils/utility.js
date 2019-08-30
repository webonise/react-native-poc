import { Platform, Alert } from "react-native";
import { STRING_CONSTANTS } from "./string-constant";

export default class Utility {
  static isIOS() {
    return Platform.OS === STRING_CONSTANTS.IOS;
  }
  static showAlertWithMessage(title, message, navigation = false) {
    Alert.alert(
      title,
      message,
      [
        {
          text: STRING_CONSTANTS.OK_MSG,
          onPress: () => console.log("Ok pressed")
        }
      ],
      { cancelable: false }
    );
  }
}
