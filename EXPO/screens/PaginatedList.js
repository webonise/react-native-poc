import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";

export default class PaginatedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      page: 0,
      per_page: 0,
      total: 0,
      total_pages: 0,
      refreshing: false,
      dataReady: false
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
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          //onEndReached={this._onEndReached}
          //onEndReachedThreshold={0.9}
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
    <View>
      <Placeholder.ImageContent
        size={60}
        animate="shine"
        lineNumber={4}
        lineSpacing={5}
        lastLineWidth="30%"
        onReady={this.state.dataReady}
      >
        <>
          <Text>
            {item.first_name} {item.last_name}
          </Text>
          <Image
            source={{
              uri: item.avatar
            }}
          />
        </>
      </Placeholder.ImageContent>
    </View>
  );

  _onEndReached = () => {
    console.log("reached the end.Current page is " + this.state.page);
    this.state.page = this.state.page + 1;
    this.getUserInfo();
  };

  _onRefresh = () => {
    this.state.page = 0;
    this.refreshing = true;
    this.getUserInfo();
  };
  componentDidMount() {
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
          userList: data.data,
          refreshing: false,
          dataReady: true
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
