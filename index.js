require('dotenv').config();

// External Libraries
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');

// Create MySQL Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Routes


// Setup backend
const app = express();
app.use(express.json());
app.use(morgan('short'));
app.use(cors());
connection.connect();

// Setup Authentication middleware


// Setup routes
app.get('/', (req, res) => {
    connection.execute(
        'SELECT * FROM `User`',
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ type: 'error', message: err });
            }
            console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
        }
    );
    res.json({ type: 'success', message: 'ok' });
});


// Start Server
app.listen(process.env.PORT, () => {
    console.log(`\n${process.env.SERVER_NAME} backend started listening on port: ${process.env.PORT}`)
});
