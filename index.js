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

app.put('/employees/add', function(req, res){
    var data = req.body;
    var errors = checkInputs(data);
    if(errors.length == 0){
        let query = "INSERT INTO employee(name) VALUES('" + data.name + "');";
        con.query(query, function(error, results, fields){
            if(error) throw error;
            let query2 = "INSERT INTO employee_details(emp_id, salary, position, department) VALUES('" + results.insertId + "', '" + data.salary + "', '" + data.position + "', '" + data.department + "');";
            con.query(query2);
            return res.send('Employee record has been saved');
        })
        
    }
    else{
        return res.status(400).send(errors.join("\r\n"));
    }
})

function checkInputs(data) {
    let error = [];
    if(!data.name){
        error.push('Please enter employee name');
    }
    if(!data.salary){
        error.push('Please enter employee salary');
    }
    if(!data.position){
        error.push('Please enter employee position');
    }
    if(!data.department){
        error.push('Please enter employee department');
    }
    return error;
}

// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;
