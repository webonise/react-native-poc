import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";

export default class GridScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      page: 0,
      per_page: 0,
      total: 0,
      total_pages: 0,
      isDataFetched: false
    };
  }

  static navigationOptions = {
    title: "Paginated Grid Example"
  };

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 2 }}>
        <Placeholder.ImageContent
          size={60}
          animate="fade"
          lineNumber={4}
          lineSpacing={5}
          lastLineWidth="50%"
          onReady={this.state.isDataFetched}
        >
          <FlatList
            data={this.state.userList}
            numColumns={1}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button
            raised
            icon={{ name: "navigate-next" }}
            title="Next"
            onPress={this.gotoNextPage}
          />

          <Button
            raised
            icon={{ name: "navigate-before" }}
            title="Previous"
            onPress={this.gotoPreviousPage}
          />

          <Text>Page number - {this.state.page}</Text>
          <Text>Number of records per page - {this.state.per_page}</Text>
          <Text>Total - {this.state.total_pages}</Text>
          <Text>Total Items - {this.state.total}</Text>
        </Placeholder.ImageContent>
      </View>
    );
  }

  _renderItem = ({ item }) => (
    <View>
      <Text>{item.first_name}</Text>
    </View>
  );

  gotoNextPage = () => {
    this.getUserInfo(this.state.page + 1);
  };

  gotoPreviousPage = () => {
    this.getUserInfo(this.state.page - 1);
  };

  componentWillMount() {
    this.getUserInfo(0);
  }

  getUserInfo(page) {
    console.log("getting user info fior page " + page);

    const URL = `https://reqres.in/api/users/?page=${page}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        this.setState({
          per_page: data.per_page,
          total: data.total,
          total_pages: data.total_pages,
          page: data.page,
          userList: data.data,
          isDataFetched: true
        });
        console.log(data.per_page);
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
