import {Platform,AsyncStorage} from 'react-native';
import { SecureStore } from 'expo';


var localDB = {
    dbName : 'reactDemoInfoDB.db',
    tableName : {
      tblUser: 'tblUser',
    }
  }
  // export {
  //   localDB
  // }

   var APIConst = {
      baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=',
      apiKey: 'AIzaSyAcfolOabZSM9t_m0fqgOlYVgRa5eHAwMU',
      //'AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio',
      URNConst: {
        nearByURN: '&radius=1500&type=restaurant&key='
      }
   }

/* Asynch Storage */

   const storeDataInAsynch = async (key,values) => {

    const stringValues = JSON.stringify(values)
    console.log("Stored value"+stringValues);
    
    try {
      await AsyncStorage.setItem(key, stringValues);
    } catch (error) {
      // Error saving data
      console.log("Exception in Async Storage"+error);
    }
    
   }

    const fetchDataFromAsynch = async (key) => {

      try {
        const value = await AsyncStorage.getItem(key);
        if (value === null) {
          return null;
        }
        const item = JSON.parse(value);
        console.log(item);
        return item
        
      } catch (error) {
        console.log("Exception in Fetch Async Storage"+error);
      }
      return null
  }
/******************************  SecureStore DB ******************************/

    const storeDataInSecureStore = async (key, value) => {
        try {
            await SecureStore.setItemAsync(key, value) 
        }catch(error) {
          console.log("Exception in storeDataInSecureStore"+error);
        }
    }


    const fetchDataFromSecureStore = async (key) => {

      try {
        const profileData = SecureStore.getItemAsync(key)
        if (profileData === null) { return null }
        console.log("getDataFromSecureStore : "+profileData);
        return profileData

      }catch(error) {
          console.log("Exception in getDataFromSecureStore"+error);

      }
      
      return null

    }

   export {
      APIConst,
      localDB,
      storeDataInAsynch,
      fetchDataFromAsynch,
      storeDataInSecureStore,
      fetchDataFromSecureStore
   };

