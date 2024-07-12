const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mydb',
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

global.db = db;

//CRUD API
//Create
router.post('/', (req, res) => {
    const user = req.body;
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, (err, result) => {
        if(err){
            return res.status(500).send(err);
        }
        res.status(201).send({id: result.insertId, ...user});
    });
});

// Read All
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

// Read One
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send(result[0]);
    });
});

// Update
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const sql = 'UPDATE users SET ? WHERE id = ?';
    db.query(sql, [user, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ id, ...user });
    });
});

// Delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User deleted' });
    });
});

module.exports = router;