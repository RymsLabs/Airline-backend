const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.post('/signup', (req, res) => {
    const {fname, lname, email, addr, password, dob} = req.body;
    connection.execute(`call signup_user("${fname}","${lname}","${email}","${addr}","${password}","${dob}")`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ status: 'success', message: results[0] });
    })
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    connection.execute(`call UserLogin("${email}", "${password}")`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        if (results) {
            res.json({ type: 'success', message: results[0][0]});
        } else {
            res.json({type: 'success', message: 'Not exists'});
        }
    });
});

router.get('/ticket/history/:id', (req, res) => {
    const {id} = req.params;
    connection.execute(`call user_ticket_history(${id})`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0]});
    });
});

router.post('/flight/', (req,res) => {
    const {userId, flightId} = req.body;
    connection.execute(`call book_ticket(${userId}, ${flightId}, @result)`, (err, results) => {
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
})

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