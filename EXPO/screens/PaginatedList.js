import React from "react";
import {Alert, ListView, FlatList, StyleSheet, Text, View, Image,Dimensions,ActivityIndicator,Orientation,ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";
import {NetInfo} from 'react-native';
import { ScreenOrientation } from 'expo';
import { Constants, SQLite } from 'expo';
import { localDB } from '../screens/Constants';
import OfflineNotice from '../screens/OfflineNotice'
import MiniOfflineSign from '../screens/OfflineNotice'

const db = SQLite.openDatabase('ReactInfoDB.db');

export default class PaginatedList extends React.Component {

  constructor(props) {
    super(props);
      this.state = {  
        isConnected: true,
        userList: [],
        page: 1,
        per_page: 0,
        total: 0,
        total_pages: 0,
        refreshing: false,
        dataReady: false,
        loading: true,
        isLoadMore: false
      };  

  }

  static navigationOptions = {
    title: "Paginated Grid Example",
  };

  componentWillMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  }

  render() {

    if (this.state.loading && this.page === 1 && this.total_pages != this.page) {
      return <View style={{
        width: '100%',
        height: '100%'
      }}><ActivityIndicator style={{ color: '#000' }} /></View>;
    }

     return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <OfflineNotice /> 
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent = {this.renderSeparator}
          data={this.state.userList}
          extraData={this.state}
          numColumns={1}
          renderItem={this._renderItem}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
         /* onScrollEndDrag={() =>
          //  this.state.page = this.state.page + 1;
          // this.state.page = this.state.page+1;
           // console.log("on scroll called")
            this.getUserInfo(this.state.page)
          } */
          ListFooterComponent={this.renderFooter.bind(this)}
         onEndReached = {()=>
            this.callLoadMore()
         }
         onEndReachedThreshold={2}
        />
        <Text>Page number - {this.state.page}</Text>
        <Text>Number of records per page - {this.state.per_page}</Text>
        <Text>Total - {this.state.total_pages}</Text>
        <Text>Total Items - {this.state.total}</Text>  
      </View>
    );
  }

    callLoadMore() {
      
      if (this.state.page >= this.state.total_pages) { 
        console.log('Last page called ')
        return 
      }

      if (!this.state.isLoadMore) {
        this.getUserInfo(this.state.page)
      }
    }
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
     if (!this.state.loading) return null;
     return (
       <ActivityIndicator
         style={{ color: '#000' }}
       />
     );
   };

  _renderItem = ({ item }) => (
     <View style = {{ flex:1,flexDirection: 'row', marginBottom: 5}} >
         <Image style= {{width: 100,height: 100, borderRadius: 100/2, margin:5}}
               source = {{uri: item.avatar}}
         />
         <View style = {{ flex:1, justifyContent: 'center', marginLeft: 5 }}>
           <Text style= {{ fontSize: 18, color: 'green',marginBottom: 15}}>
               Name:  {item.first_name}   
           </Text>
           <Text style= {{ fontSize: 18, color: 'red'}}>
                 Last Name: {item.last_name}
           </Text>
         </View>
     </View>
  );  

  _onRefresh = () => {
    this.deleteTable();
    this.createDB()

    this.state.page = 1;
    this.state.userList = [];
    this.setState({
      page: 1,
      userList:  [],
      refreshing : true,
    });
    // this.refreshing = true;
    console.log("Pull to refresh"+this.state.page);
    this.initialInfo(this.state.page);
  };

  renderSeparator = () => {
    return (
        <View
          style = {{height:1, width:'100%',backgroundColor: '#778899'}}>
        </View>
    )
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    /*if (!this.state.isConnected) {
      this.initialInfo(this.state.page);
      this.fetchDB();
    }else { */
      this.deleteTable();
      this.createDB();
      this.initialInfo(this.state.page);
    //}
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  }

  getUserInfo(page) {

    this.setState({ loading: true,isLoadMore: true })
    let currentPageNumber = page+1;
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        if (currentPageNumber <= 1 ) {
            this.setState({
              userList:  [],
            });
        } 
         
      var userDataArr = data.data
      //const userArr =  [...this.state.userList, ...data.data]
      userDataArr.map(userItem =>
         this.updateDB(userItem.id,userItem.first_name,userItem.last_name,userItem.avatar,data.page, data.per_page,data.total,data.total_pages)
      );
        this.fetchDB();
      })
      .catch(function(error) {
      
        console.log(
          "There has been a problem with your fetch operation: " + error
        );
        throw error;
      });
  }

  initialInfo(page) {
   
    let currentPageNumber = page;
   // console.log("Inital current page " + currentPageNumber);
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        const userArr = data.data
        userArr.map(userItem =>
          this.updateDB(userItem.id,userItem.first_name,userItem.last_name,userItem.avatar,data.page, data.per_page,data.total,data.total_pages)
        );
        this.fetchDB();
      })
      .catch(function(error) {
        console.log( "There has been a problem with your fetch operation: " + error);
        throw error;
      });
  }

  /******************** Local DB ********************/

    createDB() {
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists UserTable (id integer primary key not null, first_name text, last_name text,avatar text, page integer,per_page integer, total integer ,total_pages integer );'
        ),
        error => {
          console.log("Not able to create table ")
        };
      });
    }

    updateDB(id, firstName,lastName,avatar,page, per_page, total, total_pages) {
        
        db.transaction(
           tx => {
             tx.executeSql('insert into UserTable (id, first_name, last_name,avatar, page, per_page, total, total_pages ) values (?, ?, ?,?,?,?,?,?)', [id, firstName,lastName,avatar, page, per_page, total, total_pages]);
             tx.executeSql('select * from UserTable', [], (_, { rows }) =>
           //   console.log(JSON.stringify(rows))
                 console.log('  Data saved ')
             );
           },
            error => {
              console.log("Excpetion data- ID-- "+id)
            }/*,
           sucess => {
               console.log("- On saving Sucess -- ");
              // this.fetchDB();
           
           } */
         );

    }

    fetchDB() {
   //   console.log("fetchDB called");

      db.transaction(
         tx => {
         tx.executeSql('select * from UserTable', [], (_, { rows }) =>
         
                  this.setState({
                    per_page: rows._array[rows._array.length-1].per_page,
                    total: rows._array[rows._array.length-1].total,
                    total_pages: rows._array[rows._array.length-1].total_pages,
                    page: rows._array[rows._array.length-1].page,
                    userList: rows._array,
                    refreshing: false,
                    dataReady: true,
                    loading: false,
                    isLoadMore : false,
                  })  
           );
         },
          error => {
            console.log("On Fetch error -- ");
            this.setState({
              loading: false,
              isLoadMore:false
             });
          }, sucess => {
               console.log("- On Fetch Sucess -- ");
           }
       );

    }

    deleteTable() {
      console.log("deleteTable called");
        db.transaction(tx => {
          tx.executeSql(
            'drop Table UserTable;'
          ),
           error => {
             console.log("On Delete error -- ");
           },
          sucess => {
              console.log("- On Delete Sucess -- ");
          };
        });
    }

  update = () => {
    console.log("update called");
    //this.updateAllUI();
  };
}

const styles = StyleSheet.create({  
  container: {  
      flex: 1,  
      backgroundColor: "#e5e5e5"  
  },  
  separator: {  
      height: 0.5, width: "100%", backgroundColor: "#000"  
  },  
  rowViewContainer: {  
      flex: 1,  
      paddingRight: 15,  
      paddingTop: 13,  
      paddingBottom: 13,  
      borderBottomWidth: 0.5,  
      borderColor: '#c9c9c9',  
      flexDirection: 'row',  
      alignItems: 'center',  
      fontSize: 20,  
      marginLeft: 10,  
  },  
});  

/*
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F5FCFF',
  }
}); */

