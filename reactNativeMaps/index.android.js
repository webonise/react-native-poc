import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';

import MapComponent from './map-view.js';


export default class reactNativeMaps extends Component {
  render() {
    StatusBar.setHidden(true);
    return (
      <MapComponent />
    );
  }
}

AppRegistry.registerComponent('reactNativeMaps', () => reactNativeMaps);
