const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    connection.execute(`call EmpLogin("${email}", "${password}",@result)`, (err, results) => {
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

router.get('/checkin/:id', (req,res) => {
    const ticketId = req.params.id;
    //TODO: Fix
    connection.execute(`call check_in(${ticketId}, 1)`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results});
    });
});

router.get('/users/', (req,res) => {
    connection.execute(`SELECT * FROM userdetailswithoutpass`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results});
    });
})



module.exports = router;