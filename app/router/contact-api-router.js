var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var contactsApiRouter = express.Router();
var Contacts = require('../model/contact-model-mysql');
var contacts = new Contacts();


var storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, (path.parse(file.originalname)).name + '-' + Date.now() + '.png');
    }
});

contactsApiRouter.get('/', function(req,res) {
    contacts.getAll(function(err, result){
        if(err){
            res.status(500).json({message: 'Error retrieving record!'});
            return;
        }
        res.status(200).json(result);
    });
});

contactsApiRouter.get('/:contactId', function(req,res) {
    var id = parseInt(req.params.contactId);

    contacts.get(id,function(err, result){
        if(err){
            if(err.status === 404)
                res.status(404).json({message: 'Rec not found!'});
            else
                res.status(500).json({message: 'Error retrieveing record!'});
            return;
        }
        res.status(200).json(result);
    });
});

contactsApiRouter.post('/', multer({storage: storage}).single('imagePath'), function(req,res) {

    var newContact = {
        firstName: req.body.firstName,
        lastName: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        imagePath: req.file !== undefined ? req.file.path : null
    };
   
    //var id = parseInt(req.params.contactId);

    contacts.append(newContact,function(err){
        if(err){
            res.status(500).json({message: 'Error appending record!'}); 
            return;
        }
        res.status(200).json({message: 'Record successfully added!'});
    });
});

contactsApiRouter.put('/:contactId', multer({storage: storage}).single('imagePath'), function(req,res) {
    var contactId = parseInt(req.params.contactId);

    var id = parseInt(req.params.contactId);
    var oldImagePath = null;
    contacts.get(id,function(err, result){
        if(err){
            if(err.status === 404)
                res.status(404).json({message: 'Rec not found!'});
            else
                res.status(500).json({message: 'Error retrieveing record!'});
            return;
        }

        oldImagePath = result[0].imagePath;
        
    });

    var oldContact = {
        contactId: contactId,
        firstName: req.body.firstName,
        lastName: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        imagePath: req.file !== undefined ? req.file.path : oldImagePath
    };

    contacts.save(oldContact,function(err){
        if(err){
            res.status(500).json({message: 'Error appending record!'}); 
            return;
        }
        res.status(200).json({message: 'Record successfully modified!'});
    });
});

contactsApiRouter.delete('/:contactId', function(req,res) {
    var contactId = parseInt(req.params.contactId);

    var id = parseInt(req.params.contactId);
    var result1 = null;
    contacts.get(id,function(err, result){
        if(err){
            if(err.status === 404)
                res.status(404).json({message: 'Rec not found!'});
            else
                res.status(500).json({message: 'Error retrieveing record!'});
            return;
        }
        result1 = result;

    });

    contacts.delete(id,function(err){
        if(err){
            res.status(500).json({message: 'Error deleting record!'}); 
            return;
        }
        if(result1[0].imagePath !== null){
            fs.unlink(result1[0].imagePath);
        }
        res.status(204).json({message: 'Record successfully deleted!'});
    });
});

module.exports = contactsApiRouter;


