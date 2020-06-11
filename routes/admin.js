var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db');
var async = require('async');
var mysql = require('mysql');


router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//courses

router.get('/', function (req, res) {
    
    var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'school'
    });

    var department = "SELECT * FROM department";
    var level = "SELECT * FROM level";

    async.parallel([
        function (callback) {
        db.query(department,callback)
        },
        function (callback) {
        db.query(level,callback)
        }], function (err, rows) {
        //console.log(RowDataPacket);
        res.render('admin/add_course', {departmentcode: rows[0][0], levelcode: rows[1][0]});
        }
    );
});


router.get('/courses', function (req, res) {
    var query = "SELECT c.*, g.department_code, p.level FROM courses_information c INNER JOIN department g on c.department_ID = g.id INNER JOIN level p on c.level_ID = p.id ";
    
    db.getData(query, null, function(rows) {
        var data = {
            'courses' : rows
        }

        res.render('admin/courses', data);
    })
});


router.post('/', function (req, res) {
    var courses = {
        course_title  : req.body.course_title,
        course_code   : req.body.course_code,
        department_ID  : req.body.department_code,
        level_ID             : req.body.level
    };
    console.log(courses);
    var query = "INSERT INTO Courses_Information SET ?"; 
    db.getData(query, [courses], function (rows) {
        console.log(rows);
        res.redirect('/admin/courses');
    });
});

router.get('/courses/edit/:id', function(req, res) {

    var db = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'school'
    });
    

    var id = req.params.id;
    var query = "SELECT * FROM courses_information WHERE ID = ? ";
    var department = "SELECT * FROM department";
    var level = "SELECT * FROM level";

    async.parallel([
        function (callback) {
            db.query(query, [id], callback)
        },
        function (callback) {
            db.query(department, callback)
        },
        function (callback) {
            db.query(level, callback)
        }], function (err, rows) {
            res.render('admin/edit_course', {couInfo: rows[0][0], depInfo: rows[1][0], levInfo: rows[2][0]})
        }
    )
})

router.post('/courses/edit/:id', function (req, res) {

    var id = req.params.id;
    var courseUpdate = {
        course_title : req.body.course_title,
        course_code : req.body.course_code,
        department_ID : req.body.departmentcode,
        level_ID : req.body.levelcode
    };

    var query = "UPDATE courses_information SET ? WHERE ID = ?";
    db.getData(query, [courseUpdate, id], function (rows) {
        res.redirect('/admin/courses')
    });

})

router.get('/courses/delid=:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM courses_information WHERE ID = ?";
    db.getData(query, [id], function (rows) {
        res.redirect('/admin/courses');
    });
});





//department----

router.get('/add_department', function(req, res) {
    res.render('admin/add_department')
});

router.get('/departments', function (req, res) {
    var query = "SELECT * FROM department";
    db.getData(query, null, function (rows) {
        var data = {
            'department': rows
        };
        
        res.render('admin/departments', data);
    })
    
});


router.post('/add_department', function (req, res) {
    var department = {
         department_name : req.body.department_name,
         department_code:  req.body.department_code,
    };
    var query = "INSERT INTO department SET ?";
    db.getData(query, [department], function (rows) {
        console.log(rows);
        res.redirect('/admin/departments');
    });
});


router.get('/departments/edit/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM department WHERE ID = ?";

    db.getData(query, [id], function (rows) {
        var data = {'departmentEdit': rows[0]};
        res.render('admin/edit_department', data);
    });
})


router.post('/departments/edit/:id', function (req, res) {
    var id = req.params.id;
    var departmentUpdate = {
        department_name: req.body.department_name,
        department_code: req.body.department_code,
    };
    var query = "UPDATE department SET ? WHERE ID = ?";

    db.getData(query, [departmentUpdate,id], function (rows) {
        res.redirect('/admin/departments');
    });
})

router.get('/departments/delid=:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM department WHERE ID = ?";
    db.getData(query, [id], function (rows) {
    res.redirect('/admin/departments');
    });
});




//level -----

router.get('/add_level', function (req, res) {
    res.render('admin/add_level');
});


router.post('/add_level', function (req, res) {
    var level = {
        level  : req.body.level,
    };
    var query = "INSERT INTO level SET ?";
    db.getData(query, [level], function (rows) {
        console.log(rows);
        res.redirect('/admin/levels');
    });
});

router.get('/levels', function (req, res) {
    var query = "SELECT * FROM level";
    db.getData(query, null, function (rows) {
        var data = {
            'level': rows
        };
        
        res.render('admin/levels', data);
    })
    
});

router.get('/levels/edit/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM level WHERE ID = ?";

    db.getData(query, [id], function (rows) {
        var data = {'levelEdit': rows[0]};
        res.render('admin/edit_level', data);
    });
})


router.post('/levels/edit/:id', function (req, res) {
    var id = req.params.id;
    var levelUpdate = {
        level: req.body.level,
    };
    var query = "UPDATE level SET ? WHERE ID = ?";

    db.getData(query, [levelUpdate,id], function (rows) {
        res.redirect('/admin/levels');
    });
})

router.get('/levels/delid=:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM level WHERE ID = ?";
    db.getData(query, [id], function (rows) {
    res.redirect('/admin/levels');
    });
});

module.exports = router;



