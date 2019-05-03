
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

export default class Notifications extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Notifications',
      drawerIcon:({tintColor}) => (
        <Image 
          style={{ width: 32, height: 32 }}
          source={{uri: 'https://img.icons8.com/ios/50/000000/bell.png'}}
        />
      ),
      headerTitle: 'Dismiss',
      headerRight: (
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Cancel"
          color="#fff"
        />
      ), headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  
    render() {
      return (
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back home"
        />
      );
    }
  }