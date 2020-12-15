const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.get('/flight/', (_, res) => {
    connection.execute(`call fetchFlightsAdmin()`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0]});
    });
});


module.exports = router;