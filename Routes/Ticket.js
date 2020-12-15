const { Router } = require('express');
const connection = require('../Utils/connection');

const router = Router();

router.get('/:id', (req, res) => {
    const {id} = req.params;
    connection.execute(`call ticket_details(${id})`, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ type: 'error', message: err });
        }
        res.json({ type: 'success', message: results[0][0]});
    });
});


module.exports = router;