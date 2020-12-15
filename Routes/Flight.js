const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.get('/remaining/:id', (req, res) => {
    const { id } = req.params;
    connection.execute(`call seatsRemaining(${id}, @remaining)`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
    });
    connection.execute(`select @remaining`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        console.log(JSON.stringify(results, null, 2)); // results contains rows returned by server
        res.json({ type: 'success', message: results[0]});
    });
});

router.post('/filter', (req,res) => {
    const {departure, arrival, dTime} = req.body;
    connection.execute(`call FetchFlight("${departure}", "${arrival}", "${dTime}")`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0][0]});
    });
});



module.exports = router;