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
                return res.status(500).json({ type: 'error', message: err });
            }
            console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
        }
    );
    res.json({ type: 'success', message: 'ok' });
});

app.get('/flight/remaining/:id', (req, res) => {
    const { id } = req.params;
    connection.execute(`call seatsRemaining(${id}, @remaining)`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ type: 'error', message: err });
            }
        }
    );
    connection.execute(`select @remaining`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
            console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
            res.json({ type: 'success', message: results[0]});
        }
    );
});


app.get('/admin/flight/', (_, res) => {
    connection.execute(`call fetchFlightsAdmin()`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ type: 'error', message: err });
            }
            res.json({ type: 'success', message: results[0]});
        }
    );
});

app.post('/user/login', (req, res) => {
    const {email, password} = req.body;
    connection.execute(`call UserLogin("${email}", "${password}",@result)`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
    }
);
connection.execute(`select @result`, (err, results) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ type: 'error', message: err });
    }
        console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
        res.json({ type: 'success', message: results[0]});
    }
);
});

app.get('/ticket/:id', (req, res) => {
    const {id} = req.params;
    connection.execute(`call TicketDetails(${id})`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0][0]});
    }
);
});

app.post('/flight/filter', (req,res) => {
    const {departure, arrival, dTime} = req.body;
    connection.execute(`call FetchFlight("${departure}", "${arrival}", "${dTime}")`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0][0]});
    });
});

app.get('/employee/checkin/:id', (req,res) => {
    const ticketId = req.params.id;
    //TODO: Fix
    connection.execute(`call check_in(${ticketId}, 1)`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results});
    });
})

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`\n${process.env.SERVER_NAME} backend started listening on port: ${process.env.PORT}`)
});
