import { SQLite } from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";
import { DB_CONSTANTS } from "../utils/string-constant";

export default class DatabaseManager extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return async () => SQLite.openDatabase(DB_CONSTANTS.DB_NAME);
  }

  static get tableName() {
    return DB_CONSTANTS.TABLE_NAME;
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      title: { type: types.TEXT, not_null: true },
      description: { type: types.TEXT },
      timestamp: { type: types.INTEGER, default: () => Date.now() }
    };
  }

  static fetchRecords(query) {
    return query(options);
  }
}

//Reference - https://www.npmjs.com/package/expo-sqlite-orm/v/1.4.1
