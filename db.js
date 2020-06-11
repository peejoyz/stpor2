var mysql = require('mysql');

module.exports = {
    getData: function(sql, param, callback){
        var db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'school'
        });

        db.connect(function(err){
            if(err)
            {
                console.log('error connecting database ...');
            }
        });
        if(param == null)
        {
            db.query(sql, function(err, result){
                callback(result);
            });
        }
        else
        {
            db.query(sql, param, function(err,result){
                callback(result);
            });
        }
    }
};

