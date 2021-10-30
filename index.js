const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;


//username = newEma
//password = 6Cb3gxS9zbBqki4v

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvwhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully')
        const database = client.db('online_shop2');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');


        //Get Products Api
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //Add orders api
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
    }
    finally {
        // await client close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Ema jon server is running')
})

app.listen(port, () => {
    console.log('server running at port', port);
})