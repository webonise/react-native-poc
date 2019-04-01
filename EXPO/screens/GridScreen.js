import React from 'react';
import { FlatList, StyleSheet,Text,View,Image,Button } from 'react-native';
import { Icon } from 'react-native-elements'
import { ExpoLinksView } from '@expo/samples';

export default class GridScreen extends React.Component {

  constructor(props) {
    super(props);
    //this.getUserInfo = getUserInfo.bind(this);
    //this.gotoNextPage= gotoNextPage.bind(this);
    this.state = {
      userList: [],
      page: 0,
      per_page: 0,
      total: 0,
      total_pages: 0
    };
  }

  static navigationOptions = {
    title: 'Links',
  };


  render() {
    return (
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.userList}
          numColumns={3}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
 raised
 icon={{name: 'cached'}}
 title='Next'
 onPress ={this.gotoNextPage}
  />

  <Button
raised
icon={{name: 'cached'}}
title='Previous'
onPress ={this.gotoPreviousPage}
/>


        <Text>Page number - {this.state.page}</Text>
        <Text>Number of records per page - { this.state.per_page}</Text>
        <Text>Total - {this.state.total_pages}</Text>
        <Text>Total Items - {this.state.total}</Text>
      </View>

    );
  }

  _renderItem = ({item}) => (

      <View style={{
          flex: 1,
          margin: 5,
          minWidth: 50,
          maxWidth: 150,
          height: 304,
          maxHeight:304,
          backgroundColor: '#FFF',
      }}>
      <Text>{item.first_name} {item.last_name}</Text>
      <Image source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}/>
      </View>
  );

  gotoNextPage = () => {
    this.getUserInfo(this.state.page+1)
  }


  gotoPreviousPage = () =>{
    this.getUserInfo(this.state.page-1)
}

  componentWillMount(){
    this.getUserInfo(0)
  }

    getUserInfo (page){
    console.log("getting user info fior page " + page)

    const URL = `https://reqres.in/api/users/?page=${page}`;
    return fetch(URL)
            .then((res) =>res.json())
            .then(data =>{
              this.setState({
                per_page:data.per_page,
                total:data.total,
                total_pages:data.total_pages,
                page:data.page,
                userList:data.data
              })
              console.log(data.per_page)
            })
            .catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error);
                  // ADD THIS THROW error
                throw error;
    });
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
