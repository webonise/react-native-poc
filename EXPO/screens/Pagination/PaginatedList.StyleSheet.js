import React from "react";
import {StyleSheet } from "react-native";


 export const PaginatedStyles = StyleSheet.create({
    activityIndicatorStyle: {
        width: '100%',
        height: '100%'
    },rootViewStyle: { 
        flex: 1, 
        paddingTop: 20 
    },parentViewStyle: { 
        flex:1,
        flexDirection: 'row', 
        marginBottom: 5
    },detailViewStyle: { 
        flex:1, 
        justifyContent: 'center', 
        marginLeft: 5
    },
    imageStyle: {   
      width: 100,
      height: 100,
      borderRadius: 100/2,
      margin:5
    },firstNameStyle: { 
        fontSize: 18, 
        color: 'green',
        marginBottom: 15
    },lastNameStyle: { 
        fontSize: 18, 
        color: 'red'
    }  
  });  

  