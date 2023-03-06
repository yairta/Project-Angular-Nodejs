import mysql from 'mysql';

export const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'angular-project-nodejs',
});

con.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('DB Connected');
});