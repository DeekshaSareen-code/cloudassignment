const express = require('express');

const PORT = 8000;

const app = express();
const axios = require('axios')
app.use(express.json()); 

app.post('/storestudents', function(req, res) {
    const data = req.body.data;
    var AWS = require('aws-sdk');
   
    
  });
  
app.listen(PORT);