var http = require('http');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mysql = require('mysql');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

// connection configurations
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees'
});

con.connect();

app.get('/', function(req, res){
    res.send('Helllo World');
})

app.get('/employees/get/all', function(req, res){
    let query = "SELECT * FROM `employee` INNER JOIN employee_details ON employee.id = employee_details.id;";
    con.query(query, function(error, results, fields){
        if(error) throw error;
        return res.send(results);
    })
})

app.get('/employees/get', function(req, res){
    let user_id = req.body.user_id;
    if(!user_id){
        return res.status(400).send('Please provide user id');
    }
    let query = "SELECT * FROM `employee` INNER JOIN employee_details ON employee.id = employee_details.id WHERE employee.id = " + user_id;
    con.query(query, function(error, results, fields){
        if(error) throw error;
        return res.send(results);
    })
})

// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;
