import React, { Component } from "react";
import AsyncImageAnimated from 'react-native-async-image-animated';

import {StyleSheet,Platform } from "react-native";
import { Constants } from "expo";

export const homestyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: Constants.statusBarHeight,
      backgroundColor: "#ecf0f1"
    },paragraph: {
      margin: 24,
      fontSize: 18,
      textAlign: "center"
    },buttonContainer: {
        width: 100,
        height: 60,
        marginLeft: 180,
        marginBottom:15,
        alignItems: 'flex-end',
         marginRight: 50,
         paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
    },textContainer: {
        borderBottomWidth:1.5,
        borderBottomColor: "black",
        width: 200,
        height: 60,
        marginLeft: 15,
        marginBottom:15,
        alignItems: 'flex-start',
        marginRight: 20,
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
    },distanceStyle: { 
        flexDirection: 'column',
        justifyContent: 'flex-start',  
        marginRight: 5,
        backgroundColor: 'white'
    },hotelTitleStyle: { 
        flex:1, 
        justifyContent: 'center',
        marginLeft: 5,
        backgroundColor: 'white' 
    },viewCardStyle: {     
         flex:1,
         flexDirection: 'row',
         height: 120, 
         marginBottom: 5,
         borderBottomColor: '#D3D3D3',
         borderBottomWidth: 1,margin: 8
    }
  });
  
