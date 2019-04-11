import React from "react";
import { ListView, FlatList, StyleSheet, Text, View, Image,Dimensions,Orientation } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";
import { ScreenOrientation } from 'expo';

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
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent = {this.renderSeparator}
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
            this.getUserInfo(this.state.page)

         }

        />
        <Text>Page number - {this.state.page}</Text>
        <Text>Number of records per page - {this.state.per_page}</Text>
        <Text>Total - {this.state.total_pages}</Text>
        <Text>Total Items - {this.state.total}</Text>
      </View>
    );
  }

  _renderItem = ({ item }) => (
    <View style = {{ flex:1,flexDirection: 'row', marginBottom: 3}} >
        <Image style= {{width: 100,height: 100, borderRadius: 100/2, margin:5}}
              source = {{uri: item.avatar}}
        />
        <View style = {{ flex:1, justifyContent: 'center', marginLeft: 5 }}>
          <Text style= {{ fontSize: 18, color: 'green',marginBottom: 15}}>
              {item.first_name}
          </Text>
          <Text style= {{ fontSize: 18, color: 'red'}}>
                {item.last_name}
          </Text>
        </View>
    </View>

  );

  _onRefresh = () => {
    this.state.page = 1;
    this.state.userList = [];
    this.refreshing = true;
    console.log("Pull to refresh"+this.state.page);
    this.initialInfo(1);
  };

  renderSeparator = () => {
    return (
        <View
          style = {{height:1, width:'100%',backgroundColor: '#778899'}}>
        </View>
    )
  }
  componentDidMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
    this.initialInfo(1);
    //getUserInfo(this.state.page);
  }



  getUserInfo(page) {

    let currentPageNumber = page+1;

    console.log("current page " + currentPageNumber);
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        if (currentPageNumber <= 1 ) {
            this.state.userList = []
            console.log("empty list"+this.state.userList.length);
        }

        this.setState({

          per_page: data.per_page,
          total: data.total,
          total_pages: data.total_pages,
          page: data.page,
          userList:  [...this.state.userList, ...data.data],
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

initialInfo(page) {

  let currentPageNumber = page;

  console.log("Inital current page " + currentPageNumber);
  const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
  return fetch(URL)
    .then(res => res.json())
    .then(data => {
      this.setState({

        per_page: data.per_page,
        total: data.total,
        total_pages: data.total_pages,
        page: data.page,
        userList:  [...this.state.userList, ...data.data],
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


}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F5FCFF',
  }
});
