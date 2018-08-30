var express = require('express');
var request = require('request');

var profileRouter = express.Router();

profileRouter.get('/profile', function(req, res){

    var newContact = {
        contactId: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        imagePath: null
    };    
    res.render('pages/profile', {newRecord: true, contact: newContact});
});

profileRouter.get('/profile/:contactId', function(req, res){

    request.get({
        url: 'http://localhost:3000/v1/contact/' + req.params.contactId
    }, function(err,response, body){
        if (!err && response.statusCode === 200) {
            var oldContact = JSON.parse(body)[0];
            res.render('pages/profile', {newRecord: false, contact: oldContact});
        }
    });
       
});


module.exports = profileRouter;