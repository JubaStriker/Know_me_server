const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());



const uri = process.env.DB_USER;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('KnowMe').collection('users');
        const postsCollection = client.db('KnowMe').collection('posts');


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        app.put('/users', async (req, res) => {
            const filterEmail = req.query.email;
            const filter = { email: filterEmail }
            const user = req.body;
            const { name, email, gender, age, hometown, relationshipStatus, profilePicture, education } = user
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: name,
                    email: email,
                    gender: gender,
                    age: age,
                    hometown: hometown,
                    relationshipStatus: relationshipStatus,
                    profilePicture: profilePicture,
                    education: education

                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })

        app.get('/post', async (req, res) => {
            const query = {}
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postsCollection.findOne(query);
            res.send(result);
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            res.send(result);
        })

        app.put('/comment', async (req, res) => {
            const comment = req.body;
            const filter = { _id: ObjectId(comment.id) }
            const { text, commenter, commenterPhoto } = comment;
            const options = { upsert: true }
            const updatedDoc = {
                $push: {
                    comment: {
                        text: text,
                        commenter: commenter,
                        commenterPhoto: commenterPhoto
                    }
                }
            }

            const result = await postsCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })

        app.put('/like/:id', async (req, res) => {
            const like = req.body.like;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    like: like
                }
            }
            const result = await postsCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })
    }

    finally {

    }
}

run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('know me server is running');
})

app.listen(port, () => {

    console.log(`Know me server is running on port ${port}`);
});

