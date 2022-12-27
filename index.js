const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());



const uri = process.env.DB_USER;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get('/', async (req, res) => {
    res.send('know me server is running');
})

app.listen(port, () => {

    console.log(`Know me server is running on port ${port}`);
});

