var mysql = require('mysql');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "assignment-secret",
    secret,
    decodedBinarySecret;
AWS.config.update({
    accessKeyId: "ASIAQDZO73YJHEZZNN4P",
        secretAccessKey: "+68nJoPGatsI0hw7AXLd4M0opoxwuHareiBeswHf",
        sessionToken:"FwoGZXIvYXdzEDEaDHjuicxfqGEJ099y0CLAAbPDCRG+xouguai+B7Lwb+BiTC3Yqi//hkyMME5Dn98zEs8UPV17mWIKOXGk6YyFtXtY0alTVMrmwh6qrux3OceAiVBNZVXpoHiVkBXah989oNe1gN2Dwf6z183+fZDrgDfbdbPYunQZNFd2L1D5xhigsY8KPGaWz7stSZCh5KrfJIsz6ngO8iggc0PYemJK/uLgP5P1cM/u60H6Ht2PtnGf7dDn0bSv+Yb1wT4kY0dOqrWcAyJZ8T9Aq9PGwU5ZdyimhYKSBjItMMP0ZHnUfqcyhxGvgfl+5IxAw4wIICoHhCVz6az9d+4/sag35uKnxZ7HjJU1",
        region: "us-east-1"
});
// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

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
    console.log(JSON.parse(secret));
    
    var connection = mysql.createConnection({
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
            
            console.log('Server listening on port 3000');
      }
     });
     app.listen(3000);
     app.use(bodyParser.json())
     app.post('/storestudents', function(req, res) {
        const data = req.body.students;
        console.log(data)
        var jsondata = req.body.students;
        var values = []
        for(var i=0; i< jsondata.length; i++)
        values.push([jsondata[i].first_name,jsondata[i].last_name,jsondata[i].banner]);
        connection.query('INSERT INTO students (last_name, first_name,banner) VALUES ?', [values], function(err,result) {
            if(err) {
               res.send('Error');
            }
           else {
               res.send('Success');
            }
          });
      });
    connection.end();
});

//console.log(JSON.parse(secret))