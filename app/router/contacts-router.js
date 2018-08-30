var express = require('express');
var request = require('request');

var contactsRouter = express.Router();
contactsRouter.get('/', function(req, res){

    request.get({
        url: 'http://localhost:3000/v1/contact'
    }, function(err, response, body) {
        if(!err && response.statusCode === 200){
            var rows = JSON.parse(body);
            res.render('pages/contacts', {rows: rows});
        }
    });
 
});

module.exports = contactsRouter;