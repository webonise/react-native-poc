import React from "react";
import { Platform,Image,TouchableOpacity } from "react-native";
import { ScreenOrientation } from 'expo';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import GridScreen from "../screens/GridScreen";
import PaginatedList from '../screens/Pagination/PaginatedList';
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
  SettingsStack,
  
});
