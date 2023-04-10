const express = require("express");
const bodyParser = require("body-parser");
const request = require("postman-request");
const { get } = require("request");
const { Http2ServerRequest } = require("http2");
const https = require("https")

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    console.log("")
    res.sendFile(__dirname + "/signup.html")
});


app.post("/", function(req, res){
    var firstName = req.body.fName;
    var lastName=req.body.lName;
    var email=req.body.email;

    //console.log(firstName, lastName, email)

    var data={
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data)

    const url = "https://us21.api.mailchimp.com/3.0/lists/26f8db23d5";

    const option ={
        method: "POST",
        auth: "zeke:3d72d5477b9f89f9a464990e74ef7507-us21"
    }
    const request = https.request(url, option, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname +"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
})

// API KEY:
// 3d72d5477b9f89f9a464990e74ef7507-us21

//https://us21.api.mailchimp.com/3.0/lists/26f8db23d5

//zeke:3d72d5477b9f89f9a464990e74ef7507-us21

// List ID
//26f8db23d5
