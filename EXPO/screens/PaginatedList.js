import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";

export default class PaginatedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      page: 0,
      per_page: 0,
      total: 0,
      total_pages: 0
    };
  }

  static navigationOptions = {
    title: "Paginated Grid Example"
  };

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          data={this.state.userList}
          numColumns={1}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text>Page number - {this.state.page}</Text>
        <Text>Number of records per page - {this.state.per_page}</Text>
        <Text>Total - {this.state.total_pages}</Text>
        <Text>Total Items - {this.state.total}</Text>
      </View>
    );
  }

  _renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        margin: 5,
        minWidth: 50,
        maxWidth: 150,
        height: 304,
        maxHeight: 304,
        backgroundColor: "#FFF"
      }}
    >
      <Text>
        {item.first_name} {item.last_name}
      </Text>
      <Image
        source={{
          uri: item.avatar
        }}
      />
    </View>
  );

  componentWillMount() {
    this.getUserInfo();
  }

  getUserInfo(page) {
    let currentPageNumber = this.state.page;
    console.log("getting user info for page " + currentPageNumber);
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        this.setState({
          per_page: data.per_page,
          total: data.total,
          total_pages: data.total_pages,
          page: data.page,
          userList: data.data
        });
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: " + error
        );
        // ADD THIS THROW error
        throw error;
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
