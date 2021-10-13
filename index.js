const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const messageBird = require('messagebird')('xuLLrc7KKPlxk9tsKWcDRtxN3');


var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
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