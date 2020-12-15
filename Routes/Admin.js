const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    connection.execute(`call AdminLogin("${email}", "${password}",@result)`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
    });

connection.execute(`select @result`, (err, results) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ type: 'error', message: err });
    }
        console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
        res.json({ type: 'success', message: results[0]});
    });
});

router.get('/flight/', (_, res) => {
    connection.execute(`call fetchFlightsAdmin()`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0]});
    });
});

router.get('/pilot/', (_,res) => {
    connection.execute('SELECT * from viewpilotdetails', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results});
    });
});

router.post('/reschedule/', (req,res) => {
    let {flightId, dTime, aTime} = req.body;
    if (!dTime) {
        dTime = ''
    }
    if (!aTime) {
        dTime = ''
    }
    connection.execute(`call reschedule(${flightId}, "${dTime}", "${aTime}")`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: 'Ok' });
    });
});

router.get('/users/', (req,res) => {
    connection.execute(`call FetchAllUsers()`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0] });
    });
})

module.exports = router;