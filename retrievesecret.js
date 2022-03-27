var mysql = require('mysql');
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

    console.log('Connected to database.');
    connection.query("SELECT * FROM students" , function (err, result, fields) { // change to your table name
        if (err) throw err;
            console.log(result); //display data from table
        process.exit(); //exit node.js server
        })
    });

    connection.end();
});

//console.log(JSON.parse(secret))