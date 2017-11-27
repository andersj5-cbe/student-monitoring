const express = require('express');
const students = express.Router();
const activeDirectory = require('activeDirectory');
const fileReader = require('file-reader');
const findComputer = require('get-computername');
const getHistory = require('get-history');
const sd = require('shutdown-windows');

let ad;

fileReader('./configs/ad.conf',function(err,data){
    if(err) return(err);
    if(data){
        ad = activeDirectory(data);
    }
});
students.get('/:studentID',function(req,res){
    let studentID = req.params.studentID;
    ad.getGroupMembershipForUser(studentID,function(err,groups){
        if(err) res.send(err);
        if(groups) res.send(groups);
    });
});
students.delete('/:studentID',function(req,res){
    let studentID = req.params.studentID;
    let options = {
        database:'\\\\tolkien\\software$\\UserLogon\\Students\\CarlBen\\logins.sqlite',
        user:studentID
    };
    findComputer(options,function(err,data){
        if(err) {
            res.send(err);
        }
        if(data){
            for(let i = 0;i<data.length;i++){
                if(data[i].computerName.includes('-X-')){
                    let computer = data[i].computerName.slice(0,-1);
                    sd(computer,function(err,data){
                        if(err) res.send({data:err});
                        if(data) res.send({data:data});
                    });
                    break;
                }
            }
        }   
    });
});
students.get('/history/:studentID',function(req,res){
    let studentID = req.params.studentID;
    let options = {
        database:'\\\\tolkien\\software$\\UserLogon\\Students\\CarlBen\\logins.sqlite',
        user:studentID
    };
    findComputer(options,function(err,data){
        if(err){
            return err;
        }
        if(data){
            for(let i=0;i<data.length;i++){
                if(data[i].computerName.includes('-X-')){
                    let computer = data[i].computerName.slice(0,-1);
                    getHistory(computer,studentID,function(err,data){
                        if(err){
                            res.send(err);
                        }
                        if(data){
                            res.send(data);
                        }
                    });
                    break;
                }
            }
        }
    });
});

module.exports = students;