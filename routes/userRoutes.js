require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

size = 10;

const hashPassword = async (text, rounds) => {
    try {
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(text, salt);
        return hash;
    } catch (error) {
        console.log(error);
    }
}

const comparePassword = async (password, hash) => {
    const value = await bcrypt.compare(password, hash);
    return value;
}

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const name = req.body.name;
        const password = await hashPassword(req.body.password, size);
        const role = req.body.role;
        const newUser = await db.query("INSERT INTO users (userName,name,email,password,role) VALUES ($1,$2,$3,$4,$5) RETURNING *",
            [username, name, email, password, role]);
        console.log("Username", username);
        console.log("Password", password);
        console.log(newUser.rows);
        res.json({
            status: "Success",
            data: {
                user: newUser.rows
            }
        })
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM users WHERE id = $1",
            [req.params.id]);
        res.json({
            status: "success",
            data: {
                user: response.rows[0]
            }
        })
    } catch (error) {
        console.log(error);
    }
});

router.post("/username", async (req, res) => {
    try {
        const response = await db.query("SELECT id FROM users WHERE userName = $1",
            [req.body.username]);
        res.json({
            user: response.rows[0]
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await db.query("SELECT * FROM users WHERE userName = $1",
            [username]);
        const check = await comparePassword(password, user.rows[0].password);
        if (check) {
            res.json({
                status: "Authorized",
                username: username,
                id: user.rows[0].id,
                role: user.rows[0].role
            });
        }
        else {
            res.json({
                status: "Invalid Credentials"
            })
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;