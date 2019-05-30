import React from "react";
import { Platform,Image,TouchableOpacity } from "react-native";
//import Icon from 'react-native-ionicons'
import { ScreenOrientation } from 'expo';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
//import GridScreen from "../screens/GridScreen";
import PaginatedList from "../screens/PaginatedList";
import MapScreen from "../screens/MapScreen";
import DrawerScreen from "../screens/DrawerScreen";
const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: "Near by me",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
     
    />
  ),  
  
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
  Grid: PaginatedList,
  Map: MapScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack
});


/*
const bottomTabNavigaotr = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack
});

const DrawerNavigator = createDrawerNavigator({
  Home:{
      screen: bottomTabNavigaotr
  }
},{
  initialRouteName: 'Home',
  contentComponent: DrawerScreen,
  drawerWidth: 300
});

const MenuImage = ({navigation}) => {
  if(!navigation.state.isDrawerOpen){
      return <Image source={{uri:'https://img.icons8.com/ios/30/000000/menu.png'}}/> //"https://img.icons8.com/ios/30/000000/menu.png" source = {{uri: item.avatar}
  }else{
      return <Image source={{uri: 'https://img.icons8.com/material/24/000000/long-arrow-left.png'}}/> //https://img.icons8.com/material/24/000000/long-arrow-left.png
  }
}

const StackNavigator = createStackNavigator({
    
  //important: key and screen name (i.e. DrawerNavigator) should be same while using the drawer navigator inside stack navigator.
  
  DrawerNavigator:{
      screen: DrawerNavigator
  }
},{
  navigationOptions: ({ navigation }) => ({
      title: 'ReactNavigation',  // Title to appear in status bar
      headerLeft: 
      <TouchableOpacity  onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())} }>
          <MenuImage style="styles.bar" navigation={navigation}/>
      </TouchableOpacity>,
      headerStyle: {
          backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

  })
});

export default StackNavigator;
*/