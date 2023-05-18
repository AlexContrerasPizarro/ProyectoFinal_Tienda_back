const express = require("express");
const router = express.Router();
const db = require('../db/db');


router.post('/create/:id', async (req, res) => {
    try {
        const newOrder = await db.query("INSERT INTO orders (userId,productid,quantity,total,name,address,delivered) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
            [req.params.id, req.body.products, req.body.quantity, req.body.total, req.body.name, req.body.address, req.body.delivered]);
        res.json({
            status: "Sucess",
            data: {
                order: newOrder.rows[0]
            }
        });
        CreateOrderArray(req.body.products, req.body.quantity);
    } catch (error) {
        console.log(error);
    }
});


router.get('/', async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM orders");
        res.json({
            status: "Success",
            data: {
                orders: response.rows
            }
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await db.query("SELECT * FROM orders WHERE id = $1",
            [req.params.id]);
        res.json({
            status: "Success",
            data: {
                order: order.rows[0]
            }
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/user/:id', async (req, res) => {
    try {
        const orders = await db.query("SELECT * FROM orders WHERE userId = $1",
            [req.params.id]);
        res.json({
            status: "Sucess",
            data: {
                userid: req.params.id,
                orders: orders.rows
            }
        });
    } catch (error) {
        console.log(error);
    }
});



let order = [];
const CreateOrderArray = (products, quantity) => {
    for (let i = 0; i < products.length; i++) {
        order.push(
            {
                item: {
                    product: products[i],
                    quant: quantity[i]
                }
            }
        )
    }
    UpdateStock();
}

const UpdateStock = () => {
    order.forEach((item) => {
        reduceStock(item.quant, item.product);
    })
}

const reduceStock = async (quantity, product_id) => {
    try {
        const response = await db.query("SELECT reduce_stock($1,$2)",
            [product_id, quantity]);
    } catch (error) {
        console.log(error);
    }
}


module.exports = router;