const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const connection = mysql.createConnection(process.env.DATABASE_URL)

app.get('/', (req, res) => {
    res.send('Hello world!!')
})

// GET all users
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json(results)
    })
})

// GET user by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({ user: results[0] })
    })
})

// CREATE user
app.post('/users', (req, res) => {
    const { title, author, price, avatar } = req.body
    connection.query(
        'INSERT INTO users (title, author, price, avatar) VALUES (?, ?, ?, ?)',
        [title, author, price, avatar],
        (err, results) => {
            if (err) return res.status(500).json({ error: err })
            res.status(201).json({ message: 'User created', id: results.insertId })
        }
    )
})

// UPDATE user
app.put('/users', (req, res) => {
    const { id, title, author, price, avatar } = req.body
    connection.query(
        'UPDATE users SET title = ?, author = ?, price = ?, avatar = ? WHERE id = ?',
        [title, author, price, avatar, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err })
            res.json({ message: 'User updated' })
        }
    )
})

// DELETE user
app.delete('/users', (req, res) => {
    const { id } = req.body
    connection.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json({ message: 'User deleted' })
    })
})

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})
