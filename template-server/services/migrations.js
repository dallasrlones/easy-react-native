import { createTable, checkTableExists, insertItem }  from './psql.js';

const migrateTable = (tableName, tableSchema) => {
    // check if table exists, if it does check schema match, if schemas match do nothing
    checkTableExists(tableName).then((exists, rowNames) => {
        if (exists == false) {
            createTable(tableName, tableSchema).then(() => {
                console.log(`${tableName} table created`);
            }).catch((err) => {
                console.log(`${tableName} table already exists`);
                console.log(err);
            });
        } else {
            console.log(`${tableName} table already exists`);
        }
    }).catch((err) => {
        console.log('error checking if table exists');
        console.log(err);
    });
};

// tables will be default have a uuid as the PK and a created_at and updated_at timestamp
const usersTableSchema = [
    // id will be a uuid
    // default createTable to have the id as the pk and uuid_generate_v4() as the default
    {  name: 'id', type: 'uuid default uuid_generate_v4()' },
    // email will be a string
    { name: 'email', type: 'varchar(255)' },
    // password will be a string
    { name: 'password', type: 'varchar(255)' },
    // created_at will be a timestamp
    { name: 'created_at', type: 'timestamp default current_timestamp' },
    // updated_at will be a timestamp
    { name: 'updated_at', type: 'timestamp default current_timestamp' }
];

migrateTable('users', usersTableSchema);