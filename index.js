require('dotenv').config();

// External Libraries
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Util Libraries
const connection = require('./Utils/connection');


// Routes
const userRoutes = require('./Routes/User');
const employeeRoutes = require('./Routes/Employee');
const adminRoutes = require('./Routes/Admin');
const flightRoutes = require('./Routes/Flight');
const ticketRoutes = require('./Routes/Ticket');

// Setup backend
const app = express();
app.use(express.json());
app.use(morgan('short'));
app.use(cors());
connection.connect();

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


app.use('/flight/', flightRoutes);
app.use('/user/', userRoutes);
app.use('/employee/', employeeRoutes);
app.use('/admin/', adminRoutes);
app.use('/ticket/', ticketRoutes);

app.use((req,res) => {
    res.json({
        status: 'error',
        message: 'Route not exists',
    });
});


// Start Server
app.listen(process.env.PORT, () => {
    console.log(`\n${process.env.SERVER_NAME} backend started listening on port: ${process.env.PORT}`)
});
