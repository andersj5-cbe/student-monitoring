const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const ad = require('activedirectory');
const session = require('client-sessions');
const classes = require('./routes/classes.js');
const students = require('./routes/students.js'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    cookieName : 'student-monitoring',
    secret : 'gwNhD2H5rs7Q83OQBP2K',
    duration: 8*60*60*1000,
    activeDuration: 5*60*1000
}));
app.use('/classes',classes);
app.use('/students',students);

app.get('/basic',function(req,res){
    res.sendFile('html/basic.html',{root : __dirname});
});


app.get('/login');


server.listen(8080);