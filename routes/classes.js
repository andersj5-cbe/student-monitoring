const express = require('express');
const ca = require('class-alphabetizer');
const classes = express.Router();
const activeDirectory = require('activeDirectory');
const fileReader = require('file-reader');
let ad;

fileReader('./configs/ad.conf',function(err,data){
    if(err) return(err);
    if(data){
        ad = activeDirectory(data);
    }
});


classes.get('/:classID',function(req,res){
    ad.getUsersForGroup(req.params.classID,function(err,users){
        if(err){
            res.send({error : err});
            return;
        }
        if(users){
            ca(users,function(err,cdata){
                if(err){
                    res.send({error : err});
                    return;
                }
                if(cdata){
                    res.send(cdata);
                    return;
                }
            });
        }
    });
});

//TODO: write tool to shutdown every computer for users in array.
classes.delete('/:classID',function(req,res){
    ad.getUsersForGroup(req.params.classID,function(err,users){
        if(err){
            res.send(err);
            return;
        }
        if(users){
            
            return;
        }
    });
});
    


module.exports = classes;