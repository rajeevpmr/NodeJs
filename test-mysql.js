var async = require('async');
var Contacts = require('./app/model/contact-model-mysql');
var contacts = new Contacts();
var newContact = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@domain.com',
    phone: '123456',
    imagePath: null
};

var oldContact = {
    contactId: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@domain.com',
    phone: '98765',
    imagePath: null
};

function asyncResult(err, message){
    if(err){
        console.log('Error: ', JSON.stringify(err));
    }else{
        console.log(JSON.stringify(message, "", 2));
    }
}

async.series([
    function(callback) {
        contacts.append(newContact, function(err){
            asyncResult(err, {message: 'Record Appended'});
            callback(null,1);
        });
    },
    function(callback) {
        contacts.getAll(function(err, rows){
            asyncResult(err, rows);
            callback(null,2);
        });
    },
    function(callback) {
        contacts.save(oldContact, function(err){
            asyncResult(err, {message: 'Record Saved'});
            callback(null,3);
        });
    },
    function(callback) {
        contacts.get(1, function(err, rows){
            asyncResult(err, rows);
            callback(null,4);
        });
    },
    function(callback) {
        contacts.delete(1, function(err){
            asyncResult(err, {message: 'Record deleted'});
            callback(null,5);
        });
    },
    function(callback) {
        contacts.getAll(function(err, rows){
            asyncResult(err, rows);
            callback(null,6);
        });
    }
],
function(err, results){
    process.exit();
});
