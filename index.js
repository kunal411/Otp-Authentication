const express = require('express');
const bodyParser = require('body-parser');

const messageBird = require('messagebird')('CfoIq4RZCKBI2kPvKbqV8jhds');


var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    return res.render('step1');
});

app.post('/step2', function(req, res){
    var number = req.body.number;
    messageBird.verify.create(number, {
        template: "Your Verification code is %token."
    }, function(err, resp){
        if(err){
            console.log(err);
            return res.render('step1', {
                error: err.errors[0].description
            });
        }
        else{
            console.log(resp);
            return res.render('step2', {
                id: resp.id
            });
        }
    });
});

app.post('/step3', function(req, res){
    var id = req.body.id;
    var token = req.body.token;
    messageBird.verify.verify(id, token, function(err, response){
        if(err){
            console.log(err);
            console.log("id is ", id);
            console.log("token is ", token);
            res.render('step2', {
                error: err.errors[0].description,
                id : id
            });
        }
        else{
            res.render('step3');
        }
    });
});


app.listen(8000);