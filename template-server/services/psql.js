import pg from 'pg';

const psqlQuery = ({ query, values }) => {
    return new Promise((resolve, reject) => {
        const client = new pg.Client({
            connectionString: process.env.DATABASE_URL,
            // ssl: true,
        });

        client.connect();

        client.query(query, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }

            client.end();
        }
        );
    });
};

// resoves(true/false, [{ name: 'column_name', type: 'data_type' }, ...])
const checkTableExists = (table) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${table}');`;
        psqlQuery({ query, values: [] }).then((res) => {
            // if table does not exist resolve(false)
            if (res.rows[0].exists == false) {
                resolve(false, []);
            } else {
                const rows = [];
                const currentRowNames = Object.keys(res.rows[0]);
                currentRowNames.forEach((rowName) => {
                    rows.push({ name: rowName, type: res.rows[0][rowName] });
                });
                resolve(res.rows[0].exists, rows);
            }
        }).catch(reject);
    });
};

const createTable = (table, columnArray) => {
    return new Promise((resolve, reject) => {
        checkTableExists(table).then(results => {
            if (results == false) {
                const columnString = columnArray.map((column) => {
                    return `${column.name} ${column.type}`;
                }).join(', ');

                const query = `CREATE TABLE ${table} (${columnString});`;

                psqlQuery({ query, values: [] }).then((res) => {
                    resolve(res);
                }).catch(reject);
            } else {
                reject();
            }
        }).catch(err => {
            reject(err);
        });
    });
};

// you da man!
const checkTableSchemaMatch = (table, schemaObj) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}';`;
        psqlQuery({ query, values: [] })
            .then((res) => {
                const columnArray = Array.isArray(res.rows) ? res.rows : [];
                const schemaArray = Object.keys(schemaObj).map((key) => {
                    return {
                        name: key,
                        type: schemaObj[key].type
                    };
                });

                if (columnArray.length !== schemaArray.length) {
                    resolve(false);
                } else {
                    let match = true;
                    for (let i = 0; i < columnArray.length; i++) {
                        if (columnArray[i].column_name !== schemaArray[i].name || columnArray[i].data_type !== schemaArray[i].type) {
                            match = false;
                            break;
                        }
                    }
                    resolve(match);
                }
            })
            .catch(reject);
    });
};



// schemaObj looks like {
// id: {
//     type: 'uuid default uuid_generate_v4()',
//     name: 'id'
// },
// // email will be a string
// email: {
//     type: 'text',
//     name: 'email'
// }, } ... for example
const updateTableSchema = (table, schemaObj) => {
    return new Promise((resolve, reject) => {
        // make sure table schema matches the schemaObj passed in and if not update the table schema
        checkTableSchemaMatch(table, schemaObj).then((match) => {
            if (match == false) {
                // loop through reach column in schemaObj and check if it exists in the table, if it doesnt add it
                const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}';`;
                psqlQuery({ query, values: [] }).then((res) => {
                    const columnArray = res.rows;
                    const schemaArray = Object.keys(schemaObj).map((key) => {
                        return {
                            name: key,
                            type: schemaObj[key].type
                        };
                    });

                    // console.log({columnArray, schemaArray})

                    if (columnArray.length != schemaArray.length) {

                        // add new columns to table in db
                        const newColumns = schemaArray.filter((schemaColumn) => {
                            let found = false;
                            for (let i = 0; i < columnArray.length; i++) {
                                if (columnArray[i].column_name == schemaColumn.name) {
                                    found = true;
                                }
                            }
                            return found == false;
                        });

                        // console.log({newColumns})

                        const newColumnString = newColumns.map((column) => {
                            return `ADD COLUMN ${column.name} ${column.type}`;
                        }).join(', ');

                        const query = `ALTER TABLE ${table} ${newColumnString};`;

                        psqlQuery({ query, values: [] }).then((res) => {
                            resolve();
                        }).catch(reject);

                    }
                }).catch(reject);
            } else {
                resolve();
            }
        }).catch(reject);

    });
};

const insertItem = (table, values) => {
    return new Promise((resolve, reject) => {
        const valueKeys = Object.keys(values);
        const valueValues = Object.values(values);

        const valueString = valueKeys.map((key, index) => {
            return `$${index + 1}`;
        }).join(', ');

        const query = `INSERT INTO ${table} (${valueKeys.join(', ')}) VALUES (${valueString}) RETURNING *;`;

        // console.log({query, valueValues})

        psqlQuery({ query, values: valueValues }).then((res) => {
            resolve(res.rows[0]);
        }).catch(reject);
    });
};

const getItem = (table, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table} WHERE id = $1;`;
        psqlQuery({ query, values: [id] }).then((res) => {
            resolve(res.rows[0] || null);
        }).catch(reject);
    });
};

const getItemBy = ({ table, props }) => {
    return new Promise((resolve, reject) => {
        const selector = Object.keys(props).map((key, index) => {
            return `${key} = $${index + 1}`;
        }).join(' AND ');

        const selectorValues = Object.values(props);
        const query = `SELECT * FROM ${table} WHERE ${selector};`;

        psqlQuery({ query, values: selectorValues }).then((res) => {
            resolve(res.rows[0] || null);
        }).catch(reject);
    });
};

const getItems = ({ table, props, limit }) => {
    return new Promise((resolve, reject) => {
        if (props == undefined) {
            // get the whole table
            let query = `SELECT * FROM ${table} LIMIT ${limit || 10};`;
            psqlQuery({ query, values: [] }).then((res) => {
                resolve(res.rows);
            }).catch(reject);
        } else {
            const selector = Object.keys(props).map((key, index) => {
                return `${key} = $${index + 1}`;
            }).join(' AND ');

            const selectorValues = Object.values(props);

            const query = `SELECT * FROM ${table} WHERE ${selector} LIMIT ${limit || 10};`;

            psqlQuery({ query, values: selectorValues }).then((res) => {
                resolve(res.rows);
            }).catch(reject);
        }
    });
};

const updateItems = ({ table, props, values }) => {
    return new Promise((resolve, reject) => {
        const selector = Object.keys(props).map((key, index) => {
            return `${key} = $${index + 1}`;
        }).join(' AND ');

        const selectorValues = Object.values(props);

        const valueKeys = Object.keys(values);
        const valueValues = Object.values(values);

        const valueString = valueKeys.map((key, index) => {
            return `${key} = $${selectorValues.length + index + 1}`;
        }).join(', ');

        const query = `UPDATE ${table} SET ${valueString} WHERE ${selector} RETURNING *;`;

        const queryValues = [...selectorValues, ...valueValues];

        psqlQuery({ query, values: queryValues }).then((res) => {
            resolve(res.rows);
        }).catch(reject);

    });
};

const updateItem = ({ table, id, values }) => {
    return new Promise((resolve, reject) => {
        const valueKeys = Object.keys(values);
        const valueValues = Object.values(values);

        const valueString = valueKeys.map((key, index) => {
            return `${key} = $${index + 1}`;
        }).join(', ');

        const query = `UPDATE ${table} SET ${valueString} WHERE id = $${valueValues.length + 1} RETURNING *;`;

        const queryValues = [...valueValues, id];

        psqlQuery({ query, values: queryValues }).then((res) => {
            resolve(res.rows[0] || null);
        }).catch(reject);
    });
};

const deleteItem = (table, id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *;`;
        psqlQuery({ query, values: [id] }).then((res) => {
            resolve(res.rows[0] || null);
        }).catch(reject);
    });
};

const deleteItems = ({ table, props }) => {
    return new Promise((resolve, reject) => {
        const selector = Object.keys(props).map((key, index) => {
            return `${key} = $${index + 1}`;
        }).join(' AND ');

        const selectorValues = Object.values(props);

        const query = `DELETE FROM ${table} WHERE ${selector} RETURNING *;`;

        psqlQuery({ query, values: selectorValues }).then((res) => {
            resolve(res.rows);
        }).catch(reject);
    });
};

const psqlService = {
    psqlQuery,
    checkTableExists,
    createTable,
    insertItem,
    getItem,
    getItemBy,
    getItems,
    updateItem,
    updateItems,
    deleteItem,
    deleteItems,
    checkTableSchemaMatch,
    updateTableSchema
};

export {
    psqlService as default,
    psqlQuery,
    checkTableExists,
    createTable,
    insertItem,
    getItem,
    getItemBy,
    getItems,
    updateItem,
    updateItems,
    deleteItem,
    deleteItems,
    checkTableSchemaMatch,
    updateTableSchema
};