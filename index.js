const express = require('express');
const findComputer = require('get-computerName');
const getHistory = require("get-history");
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const sd = require("shutdown-windows");
const ad = require("activedirectory");
const session = require("client-sessions");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    cookieName : 'student-monitoring',
    secret : 'gwNhD2H5rs7Q83OQBP2K',
    duration: 8*60*60*1000,
    activeDuration: 5*60*1000
}));


app.get("/basic",function(req,res){
    res.sendFile("html/basic.html",{root : __dirname});
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
app.get("/history/:studentID",function(req,res){
    let studentID = req.params.studentID;
    let options = {
        database:'\\\\tolkien\\software$\\UserLogon\\Students\\CarlBen\\logins.sqlite',
        user:studentID
    }
    findComputer(options,function(err,data){
        if(err){
            console.log('error');
            console.log(err);
            return err;
        }
        if(data){
            for(let i=0;i<data.length;i++){
                if(data[i].computerName.includes('-X-')){
                    console.log(data[i]);
                    let computer = data[i].computerName.slice(0,-1);
                    getHistory(computer,studentID,function(err,data){
                        if(err){
                            console.log(err);
                            res.send(err);
                        }
                        if(data){
                            console.log(data);
                            res.send(data);
                        }
                    });
                    break;
                }
            }
        }
    })
});



server.listen(8080);