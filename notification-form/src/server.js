const https = require('https');

const express = require('express');

const app = express(),
    bodyParser = require("body-parser");
    port = 3080;

let supervisors = {};

https.get('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers',  (response) => {
    let data = [];

    response.on('data', chuck =>{
        data.push(chuck);
    });

    response.on('end', () =>{
        const regex = new RegExp('^[a-zA-Z]+$');
        let parsedFilteredSortedFormated = JSON.parse(Buffer.concat(data).toString())
            .filter(item =>{
                return item.jurisdiction.match(regex);
            })
            .sort((a,b) =>{
                if(a.jurisdiction == b.jurisdiction){
                    if(a.lastName == a.firstName){
                        return a.firstName > b.firstName ? 1 : -1;
                    }
                    return a.lastName > b.lastName ? 1 : -1;
                }
                return a.jurisdiction > b.jurisdiction ? 1 : -1;
            })
            .map(item =>({
                supervisor: `${item.jurisdiction} - ${item.lastName}, ${item.firstName}`
            }));

        supervisors = parsedFilteredSortedFormated;
    });
});

app.use(express.static(process.cwd()+"/dist/notification-form/"))
app.use(bodyParser.json());

app.get('/api/supervisors', (req, res) => {
    res.json(supervisors);
});

app.post('/api/notification', (req, res) => {
    let notification = req.body.notification;
    if(notification.firstName === '' || notification.lastName === '' || notification.supervisor === ''){
        throw new Error('The required parameters were not provided');
    }else{
        console.log(notification);
        res.json("Succesfully posted the notification");
    }
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd()+"/dist/notification-form/index.html")
});

app.listen(port, () =>{
    console.log(`Server listening on the port ::${port}`);
})