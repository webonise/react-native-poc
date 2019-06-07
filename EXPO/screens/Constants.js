import {Platform,AsyncStorage} from 'react-native';
import { SecureStore } from 'expo';


  export var localDB = {
    dbName : 'reactDemoInfoDB.db',
    tableName : {
      tblUser: 'tblUser',
    }
  }

  export var APIConst = {
      baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=',
      apiKey: 'AIzaSyAcfolOabZSM9t_m0fqgOlYVgRa5eHAwMU',
      imageCONST: 'https://maps.googleapis.com/maps/api/place/photo?photoreference=',
      paginatedAPIURL: 'https://reqres.in/api/users/?page=',
      //'AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio',
      URNConst: {
        nearByURN: '&radius=1500&type=restaurant&key=',
      }
   }

   export var URICONST = {
     NearBy_Icon: 'https://img.icons8.com/ios/50/000000/3-star-hotel.png',
     PlaceHolder_Icon: 'https://img.icons8.com/color/100/000000/4-star-hotel.png',
     DRAWER_ICON: 'https://png.icons8.com/ios/2x/menu-filled.png',
     NOTIFICATION_ICON: 'https://img.icons8.com/ios/50/000000/bell.png',
     USER_ICON: 'https://img.icons8.com/ios/150/000000/user-male-circle.png',
   }

   export var KeyConst = {
     ASYNCH_STORE_Key: 'profileImage',
     SECURE_STORE_Key: 'ProfilePic',
     GOOGLEAPI_KEY: 'AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio',

   }

/* Asynch Storage */

   export  const storeDataInAsynch = async (key,values) => {

    const stringValues = JSON.stringify(values)
    console.log("Stored value"+stringValues);
    
    try {
      await AsyncStorage.setItem(key, stringValues);
    } catch (error) {
      // Error saving data
      console.log("Exception in Async Storage"+error);
    }
    
   }

   export const fetchDataFromAsynch = async (key) => {

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

    export const storeDataInSecureStore = async (key, value) => {
        try {
            await SecureStore.setItemAsync(key, value) 
        }catch(error) {
          console.log("Exception in storeDataInSecureStore"+error);
        }
    }


    export const fetchDataFromSecureStore = async (key) => {

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

