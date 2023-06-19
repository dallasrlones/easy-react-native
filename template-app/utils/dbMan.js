// this will be a sql service for react-native that uses the built in sqlite3 module

// it will have, getItem, getItems, setItem, setItems, updateItem, updateItems, deleteItem, and deleteItems
// it will also have a query method that will take a sql query and return the results
// it will also have a method to create a table
// import { openDatabase } from 'react-native-sqlite-storage';

// const db = openDatabase({ name: 'prepnet.db' });

function Query({ query, onError, responseHandler }) {
    // db.transaction((tx) => {
    //     tx.executeSql(query, [], (tx, results) => {
    //         responseHandler(results);
    //     }, (error) => {
    //         onError(error);
    //     });
    // });
}

function CreateTableIfNotExists({ table, tableOptions, onError, responseHandler }) {
    // tableOptions will be the properties of the table Ex: { name: 'TEXT', age: 'INTEGER' }
    let query = `CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY AUTOINCREMENT, `;
    for (const key in tableOptions) {
        query += `${key} ${tableOptions[key]}, `;
    }
    query = query.slice(0, -2);
    query += ')';
    Query({ query, onError, responseHandler });
}


function GetItem({ table, id, responseHandler, onError }) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`;
    Query({ query, onError, responseHandler });
}

function GetItems({ table, findOptions, responseHandler, onError, limit }) {
    let query = `SELECT * FROM ${table}`;
    if (findOptions) {
        query += ' WHERE ';
        for (const key in findOptions) {
            query += `${key} = ${findOptions[key]} AND `;
        }
        query = query.slice(0, -5);
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    Query({ query, onError, responseHandler });
}

function SetItem({ table, item, onError, responseHandler }) {
    let query = `INSERT INTO ${table} (`;
    let values = 'VALUES (';
    for (const key in item) {
        query += `${key}, `;
        values += `${item[key]}, `;
    }
    query = query.slice(0, -2);
    values = values.slice(0, -2);
    query += ') ';
    values += ')';
    query += values;
    Query({ query, onError, responseHandler });
}

function SetItems({ table, items, onError, responseHandler }) {
    let query = `INSERT INTO ${table} (`;
    let values = 'VALUES ';
    for (const key in items[0]) {
        query += `${key}, `;
    }
    query = query.slice(0, -2);
    query += ') ';
    for (const item of items) {
        values += '(';
        for (const key in item) {
            values += `${item[key]}, `;
        }
        values = values.slice(0, -2);
        values += '), ';
    }
    values = values.slice(0, -2);
    query += values;
    Query({ query, onError, responseHandler });
}

function UpdateItem({ table, item, onError, responseHandler }) {
    let query = `UPDATE ${table} SET `;
    for (const key in item) {
        query += `${key} = ${item[key]}, `;
    }
    query = query.slice(0, -2);
    query += ` WHERE id = ${item.id}`;
    Query({ query, onError, responseHandler });
}

function UpdateItems({ table, items, onError, responseHandler }) {
    let query = `UPDATE ${table} SET `;
    for (const key in items[0]) {
        query += `${key} = CASE id `;
        for (const item of items) {
            query += `WHEN ${item.id} THEN ${item[key]} `;
        }
        query += 'END, ';
    }
    query = query.slice(0, -2);
    query += 'WHERE id IN (';
    for (const item of items) {
        query += `${item.id}, `;
    }
    query = query.slice(0, -2);
    query += ')';
    Query({ query, onError, responseHandler });
}

function DeleteItem({ table, id, onError, responseHandler }) {
    const query = `DELETE FROM ${table} WHERE id = ${id}`;
    Query({ query, onError, responseHandler });
}

function DeleteItems({ table, ids, onError, responseHandler }) {
    let query = `DELETE FROM ${table} WHERE id IN (`;
    for (const id of ids) {
        query += `${id}, `;
    }
    query = query.slice(0, -2);
    query += ')';
    Query({ query, onError, responseHandler });
}

export { Query, GetItem, GetItems, SetItem, SetItems, UpdateItem, UpdateItems, DeleteItem, DeleteItems, CreateTableIfNotExists };