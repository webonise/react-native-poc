var localDB ={
    dbName : 'reactDemoInfoDB.db',
    tableName : {
      tblUser: 'tblUser',
    }
  }

export {
     localDB
   };

   var APIConst = {
      baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=',
      apiKey: 'AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio',
      URNConst: {
        nearByURN: '&radius=1500&type=restaurant&key='
      }
   }

   export {
      APIConst
   };

//sudo react-native run-ios --simulator= "iPhone Xs Max"
