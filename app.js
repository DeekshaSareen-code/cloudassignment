const express = require('express');

const PORT = 8000;

const app = express();
const axios = require('axios')
app.use(express.json()); 

app.post('/storestudents', function(req, res) {
    const data = req.body.data;
    // console.log(data);
    var AWS = require('aws-sdk');
    const s3 = new AWS.S3({region: 'us-east-1'});    
    const fileName = 'data.txt';
    const params = {
        Bucket: 'deekshatest1', 
        Key: fileName, // file will be saved as deekshatest1/data.txt
        Body: data
    };
    s3.upload(params, function(error, data) {
        if (error){
            console.log(error)
            res.status(401).json({ error: 'Some error occurred' });
        } else {
            var s3url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
            res.status(200).json({ s3uri: s3url });
        }
    });
    
  });
  
app.listen(PORT);