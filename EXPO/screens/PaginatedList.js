import React from "react";
import { ListView, FlatList, StyleSheet, Text, View, Image,Dimensions,Orientation,ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { ExpoLinksView } from "@expo/samples";
import Placeholder from "rn-placeholder";
import {NetInfo} from 'react-native';
import { ScreenOrientation } from 'expo';
import { Constants, SQLite } from 'expo';
import { localDB } from '../screens/Constants';
import  UserInfoDBManager   from '../screens/UserInfoDBManager';
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
    };
  }

  static navigationOptions = {
    title: "Paginated Grid Example",

  };

  componentWillMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  }

  render() {
     return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <OfflineNotice /> 
       
      

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent = {this.renderSeparator}
          data={this.state.userList}
          numColumns={1}
          renderItem={this._renderItem}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          onEndReachedThreshold={0}
          onScrollEndDrag={() =>
          //  this.state.page = this.state.page + 1;
          // this.state.page = this.state.page+1;
           // console.log("on scroll called")
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
    this.state.page = 1;
    this.state.userList = [];

    this.setState({
      page: 1,
      userList:  [],
    });

    this.refreshing = true;
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
   // this.db = null
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
    
  //  ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
    
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  }

  getUserInfo(page) {

    let currentPageNumber = page+1;

    console.log("current page " + currentPageNumber);
    const URL = `https://reqres.in/api/users/?page=${currentPageNumber}`;
    return fetch(URL)
      .then(res => res.json())
      .then(data => {
        if (currentPageNumber <= 1 ) {
          //  this.state.userList = []
            this.setState({
              userList:  [],
            });
        }
         
      const userArr = [...this.state.userList, ...data.data]
      userArr.map(userItem =>
        this.updateDB(userItem.id,userItem.first_name,userItem.last_name,userItem.avatar,data.page, data.per_page,data.total,data.total_pages)
      );
      this.fetchDB();

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
        const userArr = data.data
        userArr.map(userItem =>
          this.updateDB(userItem.id,userItem.first_name,userItem.last_name,userItem.avatar,data.page, data.per_page,data.total,data.total_pages)
        );

        this.fetchDB()
       
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: " + error
        );
        // ADD THIS THROW error
        throw error;
      });
  }

  /******************** Local DB ********************/

    createDB() {
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists UserTable (id integer primary key not null, first_name text, last_name text,avatar text, page integer,per_page integer, total integer ,total_pages integer );'
        );
      });
    }

    updateDB(id, firstName,lastName,avatar,page, per_page, total, total_pages) {
      //  console.log("UpdateDB -- "+[id, firstName,lastName,avatar]);
        //console.log(items.avatar);
        db.transaction(
           tx => {
             tx.executeSql('insert into UserTable (id, first_name, last_name,avatar, page, per_page, total, total_pages ) values (?, ?, ?,?,?,?,?,?)', [id, firstName,lastName,avatar, page, per_page, total, total_pages]);
             tx.executeSql('select * from UserTable', [], (_, { rows }) =>
               console.log(JSON.stringify(rows))
             );
           },
            error => {
              console.log("On saving error -- ");
            },
           sucess => {
               console.log("- On saving Sucess -- ");
           }
         );

    }


    fetchDB() {
      console.log("fetchDB called");

      db.transaction(
         tx => {
         tx.executeSql('select * from UserTable', [], (_, { rows }) =>
          //   console.log(JSON.stringify(rows._array[0].total_pages))
            //console.log("Fetched Data JSON:: "+rows._array[rows._array.length-1].total_pages)

                  this.setState({

                    per_page: rows._array[rows._array.length-1].per_page,
                    total: rows._array[rows._array.length-1].total,
                    total_pages: rows._array[rows._array.length-1].total_pages,
                    page: rows._array[rows._array.length-1].page,
                    userList: rows._array,
                    refreshing: false,
                    dataReady: true,
                  })  
           );
         },
          error => {
            console.log("On Fetch error -- ");
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

  // updateAllUI() {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       `select * from tblUser `,  (_, { rows: { _array } }) => this.setState({ userList: _array })
  //     );
  //   });
  // }

  update = () => {
    console.log("update called");
    //this.updateAllUI();
  };
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F5FCFF',
  }
});

