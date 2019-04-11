import React from "react";
import {  FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";
const arr = []
export default class PaginatedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      page: 1,
      per_page: 0,
      total: 0,
      total_pages: 0,
      refreshing: false,
      dataReady: false,

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
        //  onScrollBeginDrag={() => console.log("start")}
        //  onScrollEndDrag = {() => console.log("ended")
          /*this.state.page = this.state.page + 1;
          this.getUserInfo(); */

        //  }
          onRefresh={this._onRefresh}
          onEndReachedThreshold={0}
        //  onEndReached={this.handleLoadMore}
          onScrollEndDrag={() =>
          //  this.state.page = this.state.page + 1;
          // this.state.page = this.state.page+1;
            this.getUserInfo(this.state.page+1)

         }

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

  _onRefresh = () => {
    this.state.page = 1;
    this.state.userList = [];
    this.refreshing = true;
    this.getUserInfo(1);
  };

  componentDidMount() {
    this.getUserInfo(this.state.page);
  }

  getUserInfo(page) {
    if (this.state.page == 1) {
        this.state.userList = []
        console.log("empty list"+this.state.userList);
    }
    let currentPageNumber = page;
    console.log("current page " + currentPageNumber);
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {

        this.setState({
          per_page: data.per_page,
          total: data.total,
          total_pages: data.total_pages,
          page: data.page,
          userList: [...this.state.userList, ...data.data],
          // this.state.page == 1 ? data.data : [...this.state.userList, ...data.data],
          refreshing: false,
          dataReady: true,
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


/*  handleLoadMore = () => {
    if (!this.state.loading) {
      this.page = this.page + 1;
      console.log("Loadmore called " + this.state.page);
      this.refreshing = true;
      this.getUserInfo(this.page);
    }
  }; */

}




const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});

/*
export default class LotsOfStyles extends Component {
  render() {
    return (
      <View>
        <Text style={styles.red}>just red</Text>
        <Text style={styles.bigBlue}>just bigBlue</Text>
        <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
        <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
      </View>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('react-native-poc', () => LotsOfStyles); */
