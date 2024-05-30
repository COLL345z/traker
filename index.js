const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'ymz',
        database: 'family_spending'
    }
});

const app = express();

let initialPath = path.join(__dirname, "track");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
});

app.post('/add-spending', (req, res) => {
    const { name, amount, date } = req.body;

    if (!name || !amount || !date) {
        return res.json('Fill all the fields');
    } else {
        db('track').insert({
            name: name,
            amount: amount,
            date: date
        })
        .returning('id')
        .then(data => {
            res.json({ id: data[0], name, amount, date }); // Return the newly created record with its ID
        })
        .catch(err => {
            console.error('Error adding spending record:', err);
            res.status(500).json('Error adding spending record');
        });
    }
});

app.delete('/delete-spending/:id', (req, res) => {
    const id = req.params.id; // Get the ID from the request parameters

    db('track')
        .where('id', id) // Specify the record to delete based on its ID
        .del()
        .then(deletedCount => {
            if (deletedCount === 1) {
                console.log('Spending record deleted successfully');
                res.json('Spending record deleted successfully');
            } else {
                console.error('No matching spending record found for deletion');
                res.status(404).json('No matching spending record found for deletion');
            }
        })
        .catch(err => {
            console.error('Error deleting spending record:', err);
            res.status(500).json('Error deleting spending record');
        });
});


app.get('/get-spendings', (req, res) => {
    db.select('*')
    .from('track')
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.error('Error retrieving spending records:', err); // Log the error
        res.status(500).json('Error retrieving spending records');
    });
});




app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
