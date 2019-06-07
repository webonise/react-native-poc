import React from "react";
import { StyleSheet, Image, Text, View,Button } from "react-native";
import { WebBrowser } from "expo";
import { Ionicons } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { ScreenOrientation } from 'expo';
 import {ListItemView} from '../components/ListItemView';
const modelArr = [
    {
        'id': 1,
        'name': 'demo1',
        'avator':'avator.png'
    },  {
        'id': 2,
        'name': 'demo2',
        'avator':'avator.png'
    },  {
        'id': 3,
        'name': 'demo3',
        'avator':'avator.png'
    },  {
        'id': 4,
        'name': 'demo4',
        'avator':'avator.png'
    },  {
        'id': 5,
        'name': 'demo5',
        'avator':'avator.png'
    }
]
export default class DemoList extends React.Component {
  static navigationOptions = {
    title: 'DemoList ',
    drawerIcon: ({tintColor}) => (
      <Image 
        style={{ width: 32, height: 32 }}
        source={{uri: 'https://img.icons8.com/ios/50/000000/link.png'}}
      />
    )
  }; 


  

  render() {
       return(
     
        <ListItemView data={data}
        renderItem = { (item,index) => {
            return
        }

        }

        />
       )
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
