var express = require('express');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var router = express.Router();
var db = require('../db')
var mysql = require('mysql');
var path = require('path');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school'
})


var app = express();


router.get('/', function(req, res) {
    res.render('user/index', {
        title: 'Welcome | Lautech - Student Portal'
    });
});

router.get('/register', function(req, res) {
    res.render('user/register_student', {
        title : 'Registration page',
        message : ''
    });
});

router.post('/register', function(req, res){

    var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'school'
    });
  
   if(!req.files) {
       return res.status(400).send("No files were uploaded");
   }

   let message = '';
   let full_name = req.body.full_name;
   let matric_no = req.body.matric_no;
   let password = req.body.password;
   let department = req.body.department;
   let current_level = req.body.current_level;
   let phone_number = req.body.phone_number;
   let uploadedFile = req.files.image;
   let image_name = uploadedFile.name;
   let fileExtension = uploadedFile.mimetype.split('/')[1];
   image_name = matric_no + '.' + fileExtension;

    bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        if(err) console.log(err)
        
        password = hash;
 

   var matric_noQuery = "SELECT * FROM `student_information` WHERE matric_no = '" + matric_no + "'";

   db.query(matric_noQuery, function (err, result) {
       if (err) {
           return res.status(500).send(err);
       }

       if(result.length > 0) {
           message = 'matric_no already exists';
           res.render('user/register_student', {
               message,
               title: "Registration Page"
           });
       } else {
        if(uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/gif'){
            uploadedFile.mv(`public/asset/img/${image_name}`, (err) => {
                if(err) {
                    console.log(err);

                }


                let query = "INSERT INTO `student_information` (full_name, matric_no, password, current_level, department, phone_number, image) VALUES ('" + full_name +"', '" + matric_no +"', '"+ hash +"', '" + current_level +"', '" + department +"', '" + phone_number +"', '" + image_name +"')";
                
                db.query (query, (err, result) => {
                    if(err) {
                        res.status(500).send(err);
                    }
                    req.flash('success', 'You are now registered');
                    res.redirect('/');
                })
            })
        } else {
            message = 'Invalid file format. Only jpeg, gif, png images are allowed';
            res.render('/register', {
                message,
                title : 'Registration Page'
            })
        }
           
       }
    })

    })
    })

})

router.get('/portal', function(req, res, next) {

    matric_no = req.session.matric_no;

    if(req.session.matric_no) 
    {
        let query = "SELECT * FROM `student_information` WHERE `matric_no` = '" + matric_no +"' ";
        db.query(query, (err, result) => {
            if(err) {
               console.log(err);
            }

            res.render('user/portal', {
                title : 'Lautech - student- portal : home',
                users: result
            });
        })
    } else {
        res.send('go back')
    }

   
});

router.post('/login', (req, res) =>  {

    matric_no = req.body.matric_no;
    
    let query = "SELECT * FROM `student_information` WHERE `matric_no` = '" + matric_no + "'";

    db.query(query, function(err, res) {
        if(err) {
           return res.status(400).send(err);
        }
        
    }).then(function (user){
        if(!user) {
            res.redirect('/')
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, result){
                if(result){
                    console.log('hello');
                    res.redirect('/portal');
                } else {
                    res.send('Incorrect matric and/or password');
                    res.redirect('/')
                }
            });
        }
    }); 
                   
                
})



module.exports = router;