import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,TouchableHighlight
} from "react-native";
import { WebBrowser } from "expo";
import { MonoText } from "../components/StyledText";
import { createStackNavigator, createDrawerNavigator,createAppContainer,DrawerNavigator } from "react-navigation";
import LinksScreen from "../screens/LinksScreen";
import Notifications from "../screens/Notifications";
import NearByHotel from "../screens/NearByHotel"

 class HomeScreen extends React.Component {
  // static navigationOptions = {
  //   header: null
  // };

  static navigationOptions = {
    title: 'Home ',
    drawerIcon: ({tintColor}) => (
      <Image 
        style={{ width: 32, height: 32 }}
        source={{uri: 'https://img.icons8.com/ios/50/000000/home-page.png'}}
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
    return (<View style={{
        flex: 1,
        flexDirection: 'column',
    }}> 
    <HeaderNavigationBar {...this.props} />
        <View style={{
            flex: 1,
            backgroundColor: '#4885ed',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        
            <Text style={{ fontWeight: 'bold', fontSize: 22, color: 'white' }}>
                This is Home Screen
            </Text>
            
        </View>
    </View>); 
    
}

  _navigateToExpoDocumentation = () => {
    WebBrowser.openBrowserAsync("https://docs.expo.io/versions/latest/");
  };
  
}
class HeaderNavigationBar extends React.Component {
  render() {
      return (<View style={{
          height: 70,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
      }}>
          <TouchableHighlight style={{ marginLeft: 10, marginTop: 15 }}
              onPress={() => { this.props.navigation.openDrawer() }}>
              <Image
                  style={{ width: 32, height: 32 }}
                  source={{uri: 'https://png.icons8.com/ios/2x/menu-filled.png'}}
              />
          </TouchableHighlight>
      </View>);
  }
}
export default createAppContainer(createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Links: {
    screen: LinksScreen,
  },
  Notificatin: {
    screen: Notifications,
  },NearByHotel: {
    screen: NearByHotel,
  }
},{
  initialRouteName:'Home'
}));

