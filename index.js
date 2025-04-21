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
app.get('/books', (req, res) => {
    connection.query('SELECT * FROM books', (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json(results)
    })
})

// GET user by ID
app.get('/books/:id', (req, res) => {
    const id = req.params.id
    connection.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        if (results.length === 0) {
            return res.status(404).json({ message: "books not found" })
        }
        res.json({ user: results[0] })
    })
})

// CREATE user
app.post('/books', (req, res) => {
    const { title, author, price, avatar } = req.body
    connection.query(
        'INSERT INTO books (title, author, price, avatar) VALUES (?, ?, ?, ?)',
        [title, author, price, avatar],
        (err, results) => {
            if (err) return res.status(500).json({ error: err })
            res.status(201).json({ message: 'books created', id: results.insertId })
        }
    )
})

// UPDATE user
app.put('/books', (req, res) => {
    const { id, title, author, price, avatar } = req.body
    connection.query(
        'UPDATE books SET title = ?, author = ?, price = ?, avatar = ? WHERE id = ?',
        [title, author, price, avatar, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err })
            res.json({ message: 'books updated' })
        }
    )
})

// DELETE user
app.delete('/books', (req, res) => {
    const { id } = req.body
    connection.query('DELETE FROM books WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json({ message: 'books deleted' })
    })
})

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log('CORS-enabled web server listening on port 3000')
})
