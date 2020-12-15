const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    connection.execute(`call UserLogin("${email}", "${password}",@result)`, (err, results) => {
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
        res.json({ type: 'success', message: results[0]});
    });
});

router.get('/ticket/history/:id', (req, res) => {
    const {id} = req.params;
    connection.execute(`call ims_proj.user_ticket_history(${id});`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0]});
    });
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    // Also deletes ticketId and phonenumbers
    connection.execute(`call deleteUser(${id})`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0]});
    });
});



module.exports = router;