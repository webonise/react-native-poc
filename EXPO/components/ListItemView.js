import React from "react";
import { StyleSheet,  View,FlatList } from "react-native";
import {Card,Image,Text} from 'react-native-elements'


export class ListItemView extends React.Component {
    renderData() {
        const {data,imageKey,titleKey,buttonText,bottomView } = this.props;
        return (
            <FlatList data ={data}
                keyExtractor = {(item,index) => index.toString}
                renderItem={ ({item, index}) => {
                    return(
                        <Card> 
                            key= {index.toString}
                            title={item[titleKey]}
                            image={{uri:item[imageKey]}}>
                            {bottomView(item)}
                        </Card>
                    )
                }
            }
            />
        )
    }
  render() {
    const { data } = this.props;
    if(data && data.length > 0) {
        return this.renderData();
    }else {
        return <View> </View>
    }
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});
