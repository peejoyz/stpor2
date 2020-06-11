var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');
var expressSession = require('express-session');

var app = express ();

var admin = require('./routes/admin');
var add_course = require('./routes/admin');
var add_department = require('./routes/admin');
var add_level = require('./routes/admin');
var user = require('./routes/user');
var register = require('./routes/user');


var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school'
});

db.connect(function(err) {
    if(err) {
        throw err;
    }
     console.log('connected to db')
});

global.db = db;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use(expressSession({secret: 'max', saveUninitialized: true, resave: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

app.use(require('connect-flash')());


app.use('/admin', admin)
app.use('/admin/add_course', add_course);
app.use('/admin/add_course', add_department);
app.use('/admin/add_course', add_level);
app.use('/', user);
app.use('/index/register_student', register);




app.listen(1210, function(){
    console.log('live on port 1210')
});
