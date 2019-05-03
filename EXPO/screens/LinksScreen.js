import React from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import { WebBrowser } from "expo";
import { Ionicons } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { ScreenOrientation } from 'expo';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links ',
    drawerIcon: ({tintColor}) => (
      <Image 
        style={{ width: 32, height: 32 }}
        source={{uri: 'https://img.icons8.com/ios/50/000000/link.png'}}
      />
    )
    // drawerLabel: 'Home',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../assets/images/DrawerIcon.png')}
    //     style={[styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
  }; 

  render() {
    return (
      <View>
        <Text style={styles.optionsTitleText}>
          Click on the Links to see the sample usage
        </Text>

        <Touchable
          background={Touchable.Ripple("#ccc", false)}
          style={styles.option}
          onPress={this._handlePressWeboniseLink}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Image fadeDuration={0} style={{ width: 20, height: 20 }} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Check Our Website out</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={() => this.props.navigation.navigate("Grid")}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Image
                resizeMode="contain"
                fadeDuration={0}
                style={{ width: 20, height: 20, marginTop: 1 }}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Paginated API Grid</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={() => this.props.navigation.navigate("Map")}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Image
                resizeMode="contain"
                fadeDuration={0}
                style={{ width: 20, height: 20, marginTop: 1 }}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Maps</Text>
            </View>
          </View>
        </Touchable>
      </View>
    );
  }

  _handlePressWeboniseLink = () => {
    WebBrowser.openBrowserAsync("https://facebook.com");
  };
  componentWillMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12
  },
  optionIconContainer: {
    marginRight: 9
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EDEDED"
  },
  optionText: {
    fontSize: 15,
    marginTop: 1
  }
});
