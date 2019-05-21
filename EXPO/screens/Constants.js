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
      apiKey: 'AIzaSyAcfolOabZSM9t_m0fqgOlYVgRa5eHAwMU',
      //'AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio',
      URNConst: {
        nearByURN: '&radius=1500&type=restaurant&key='
      }
   }

   export {
      APIConst
   };
