const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MongoDB connection string
const url = 'mongodb://localhost:27017';
const dbName = 'crud_app';

// MongoDB client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    // Set up routes after successful MongoDB connection
    app.post('/create', createDocument);
    app.get('/read', readDocuments);
    app.put('/update/:id', updateDocument);
    app.delete('/delete/:id', deleteDocument);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

// CRUD operations

function createDocument(req, res) {
    const data = req.body;

    client.db(dbName).collection('documents').insertOne(data, (err, result) => {
        if (err) {
            console.error('Error creating document:', err);
            res.status(500).send('Error creating document');
            return;
        }
        res.status(201).json(result.ops[0]);
    });
}

function readDocuments(req, res) {
    client.db(dbName).collection('documents').find({}).toArray((err, result) => {
        if (err) {
            console.error('Error reading documents:', err);
            res.status(500).send('Error reading documents');
            return;
        }
        res.json(result);
    });
}

function updateDocument(req, res) {
    const id = req.params.id;
    const newData = req.body;

    client.db(dbName).collection('documents').updateOne({ _id: id }, { $set: newData }, (err, result) => {
        if (err) {
            console.error('Error updating document:', err);
            res.status(500).send('Error updating document');
            return;
        }
        res.json(result);
    });
}

function deleteDocument(req, res) {
    const id = req.params.id;

    client.db(dbName).collection('documents').deleteOne({ _id: id }, (err, result) => {
        if (err) {
            console.error('Error deleting document:', err);
            res.status(500).send('Error deleting document');
            return;
        }
        res.json(result);
    });
}
