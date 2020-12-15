const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();



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



module.exports = router;