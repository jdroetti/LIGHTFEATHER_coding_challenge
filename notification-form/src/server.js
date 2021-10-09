const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
    port = 3080;

const supervisors = [];

app.use(bodyParser.json());

app.get('/api/supervisors', (req, res) => {
    res.json(supervisors);
});

app.post('/api/submit', (req, res) => {
    const notification = req.body.notification;

    res.json("looks good");
});

app.get('/', (req, res) => {
    res.send('App works');
});

app.listen(port, () =>{
    console.log(`Server listening on the port ::${port}`);
})