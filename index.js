const express = require('express');
const findComputer = require('get-computerName');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const sd = require("shutdown-windows");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/",function(req,res){
    res.sendFile("html/index.html",{root : __dirname});
});
app.get("/shutdown/:studentID",function(req,res){
    let studentID = req.params.studentID;
    let options = {
        database:'\\\\tolkien\\software$\\UserLogon\\Students\\CarlBen\\logins.sqlite',
        user:studentID
    }
    findComputer(options,function(err,data){
        if(err) {
            console.log('Error')
            console.log(err);
            res.send(err)
        }
        if(data){
            console.log('data');
            console.log(data);
            for(let i = 0;i<data.length;i++){
                if(data[i].computerName.includes('-X-')){
                    let computer = data[i].computerName.slice(0,-1);
                    sd(computer,function(err,data){
                        console.log(computer);
                        if(err) res.send({data:err});
                        if(data) res.send({data:data});
                    });
                    break;
                }
            }
        }   
    });
});

server.listen(8080);