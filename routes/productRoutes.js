const express = require("express");
const router = express.Router();
const db = require('../db/db');

router.post("/create", async (req, res) => {
    try {
        const newProduct = await db.query("INSERT INTO products (name,img,descp,price,countStock) VALUES($1,$2,$3,$4,$5) RETURNING *",
            [req.body.name, req.body.img, req.body.desc, req.body.price, req.body.count]);
        res.json({
            status: "Success",
            product: newProduct.rows[0]
        });
    } catch (error) {
        console.log(error)
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const reponse = await db.query("DELETE FROM products WHERE id = $1",
            [req.params.id]);
        res.json({
            status: "Success"
        })
    } catch (error) {

    }
})

router.get('/', async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM products');
        res.json({
            status: "sucess",
            results: response.rows.length,
            data: {
                products: response.rows
            }
        });
    } catch (error) {
        console.log(error);
    }
});


router.get("/:id", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM products WHERE id = $1",
            [req.params.id]);
        res.json({
            status: "Sucess",
            data: {
                product: response.rows[0]
            }
        }
        )
    } catch (error) {
        console.log(error);
    }
});


router.post("/update/:id", async (req, res) => {
    try {
        const updatedProduct = await db.query("SELECT add_stock($1,$2)",
            [req.params.id, req.body.addStock]);
        res.json({
            status: "Success",
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
    }
});


router.post("/update/price/:id", async (req, res) => {
    try {
        const updateProduct = await db.query("SELECT update_price($1,$2)",
            [req.params.id, req.body.newprice]);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;