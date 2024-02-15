const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const path = require('path'); 

const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();


const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

// mongoose.connect('mongodb://0.0.0.0./registrationForm', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ezwv07w.mongodb.net/registrationForm_DB`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const User = require('./models/User');

app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', (req, res) => {
    // Check if the username or email already exists
    User.findOne({ $or: [{ email: req.body.email }] })
        .then(existingUser => {
            if (existingUser) {
                return res.redirect("/error");
            }

            // If the user doesn't exist, create a new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Save the new user to the database
            newUser.save()
                .then(user => res.redirect("/success"))
                .catch(err => res.redirect("/error"));
        })
        .catch(err => res.redirect("/error"));
});

app.get("/success", (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.get("/error", (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
