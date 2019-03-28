import React from 'react';
import { FlatList, StyleSheet,Text,View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {

  constructor(props) {
    super(props);
    //this.getUserInfo = getUserInfo.bind(this);
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
          renderItem={({item}) => <Text>{item.first_name}, {item.last_name}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text>Page number - {this.state.page}</Text>
        <Text>Number of records per page - { this.state.per_page}</Text>
        <Text>Total - {this.state.total_pages}</Text>
        <Text>Total Items - {this.state.total}</Text>
      </View>
    //);
    );
  }

  componentWillMount(){
    this.getUserInfo(0)
  }

    getUserInfo (page){
    console.log("getting user info")
    const URL = `https://reqres.in/api/users`;
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
