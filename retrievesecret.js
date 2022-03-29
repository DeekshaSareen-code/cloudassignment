var mysql = require('mysql');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const { response } = require('express');
require('dotenv').config() 
var connection = mysql.createConnection({})
const PORT = 80;
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "assignment-secret",
    secret,
    decodedBinarySecret;
AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken:process.env.aws_session_token,
    region: region
});
// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

app.listen(PORT, async()=>{
    client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            throw err;
        else if (err.code === 'InvalidParameterException')
            throw err;
        else if (err.code === 'InvalidRequestException')
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            throw err;
    }
    else {
        if ('SecretString' in data) {
            
            secret = data.SecretString;

        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    console.log(JSON.parse(secret).host);
    
    connection = mysql.createConnection({
    host     : JSON.parse(secret).host,
    user     : JSON.parse(secret).username,
    password : JSON.parse(secret).password,
    port     : JSON.parse(secret).port
    });


    connection.connect(function(err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
           
        else {
            console.log('Connected to MySQL');
            console.log('Server listening on port 80');
      }
     });
    });
});
app.use(bodyParser.json())
app.post('/storestudents', function(req, res) {
        
        var jsondata = req.body.students;
        var values = []
        for(var i=0; i< jsondata.length; i++)
        values.push([jsondata[i].first_name,jsondata[i].last_name,jsondata[i].banner]);
        connection.query('Use assignment;')
        console.log(values)
        connection.query('INSERT INTO students (first_name, last_name, banner) VALUES ?', [values], function(err,result) {
            if(err) {
               res.status(400).json({ Message: 'Error'});
            }
           else {
               res.status(200).json({Message: 'Success'});
            }
          });
      });
app.get('/liststudents', function(req,res){
        connection.query('Use assignment;')
        connection.query('Select * from students;', function(err, result){
            if(err) {
                res.status(400).json({ Message: 'Error'});
             }
            else {
                const res = result;
                console.log(result)
                Object.entries(res).forEach((entry) => {
                    const [key, value] = entry;
                    console.log(`${key}: ${value}`);
                  });
                for(var i = 0;i<result.length;i++){
                    var obj = res[i]
                }
                res.send("heelo")
                ///res.status(200).json({Message: 'Success', Students: result});
             }
        })
      });
    

//connection.end();