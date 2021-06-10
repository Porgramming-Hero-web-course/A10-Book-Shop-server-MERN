const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 8000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://book-shop:bookshop1234@cluster0.wpggc.mongodb.net/book-shop?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const booksCollection = client.db("book-shop").collection("books");
    const ordersCollection = client.db("book-shop").collection("orders");
    app.get('/books', (req, res) => {
        booksCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
            })
    })

    app.get('/book/:id', (req, res) => {
        const id = req.params.id;
        booksCollection.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/order', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders, (err, result) => {
            console.log(err, result)
            res.send({ count: result.insertedCount });
        })
    })


    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/order/:email', (req, res) => {
        const email = req.params.email;
        ordersCollection.find({email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

      app.post('/addBook', (req, res) => {
        const book = req.body;
          booksCollection.insertOne(book).then((result) => {
            res.send(result.insertedCount > 0);
            console.log("Book Added");
        })
      })


      app.delete('/deleteOrder/:id', (req, res) => {
          const id = req.params.id;
          ordersCollection.deleteOne({_id: ObjectId(id)}, (err, result) => {
            if(!err) {
                res.send({count: result.insertedCount})
            }
          })
      })
});

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});