import React, { Component } from 'react';
import  SQLite   from 'react-native-sqlite-storage';
import { localDB } from '../screens/Constants';


export default  class UserInfoDBManager extends Component {

  constructor() {
       this.sqlite = SQLite;
       this.sqlite.DEBUG(true);
       this.sqlite.enablePromise(true);
       this.sqlite.openDatabase({
           name: localDB.dbName,
           location: "1"
       }).then((db) => {
           this.dbInstance = db;
       })
   }

   createTable() {
     return new Promise((resolve, reject) => {
            this.dbInstance.executeSql('CREATE TABLE IF NOT EXISTS ' + localDB.tableName.tblLogin + ' (id  INTEGER PRIMARY KEY ,firstName TEXT,lastName TEXT,avator:TEXT)'
            ).then((val) => {
                resolve(true)
            }).catch((err) => {
                console.log(err);
                reject(false)
            })
        });
   }

   dropTable() {
       return new Promise((resolve, reject) => {
           this.dbInstance.executeSql(
               "DELETE FROM"+ localDB.tableName.tblLogin
           ).then((val) => {
               resolve(true);
           }).catch((err) => {
               reject(false);
           })

       });
   }

   addOrUpdateTable(item) {
       return new Promise((resolve, reject) => {
           this.dbInstance.executeSql(
             "INSERT INTO " +
               localDB.tableName.tblLogin +
               " (id,firstName,lastName,avator) VALUES (:id, :firstName, :lastName, :avator)",
             [
               item.id,
               item.first_name,
               item.last_name,
               item.avatar
             ]
           ).then((val) => {
               resolve(true);
           }).catch((err) => {
               reject(false);
           })

       });
   }


}
