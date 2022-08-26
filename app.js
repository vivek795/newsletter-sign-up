// https://sleepy-scrubland-24817.herokuapp.com/    -> to get the application.

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));        // by this we are making a folder which is static to our computer only, to be included 
                                        // and be present on our server also so that any other file can aquire and use files present
                                    // in that folder by giving a path relative to this folder in the parent file which want to use.

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var data = {       // because mailchimp requires all data in the compressed json format in form of a single string which can be again converted into json format.
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/8b387b04f2";
    const option = {
        method: "POST",
        auth: "Vivek1:4dd89dfe31406e1c53002c39687087aa-us14"
    }

    const request = https.request(url,option,function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData) ;       // to write the jsonData to the mailchimp server so that all this data can be used to create
                                    // a new list entry.
    request.end();       // to end request after we have finished writing on our server.
})



app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){         // this is a dynamic port given by the heroku servers at time of deploying.
                                                    // OR is used to make it work both on heroku servers as well as on localhost 3000.
    console.log("Server started at port 3000.");
});


// API key = 4dd89dfe31406e1c53002c39687087aa-us14
// list id = 8b387b04f2