const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
let location = "";
let weather_description = "";
let temp = "";
let country = "";
let cloud1 = "";
let statusCode = "";
let windSpeed = "";
let humidity = "";
let noCloud = "";
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("city");
});

app.get("/weather", function(req, res){

  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let option = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  // const url = "https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=f2eda056a198e5b2eb9a97b5118cc450";
  // https.get(url, function(response){
  //   statusCode = response.statusCode;
  //   console.log(statusCode);
  //     response.on("data", function(data){
  //       const weatherData = JSON.parse(data);
  //       let icon = weatherData.weather[0].icon;
  //       const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  //       weather_description = weatherData.weather[0].description;
  //       location = weatherData.name;
  //       temp = weatherData.main.temp;
  //       country = weatherData.sys.country;
  //       windSpeed = weatherData.wind.speed;
  //       humidity = weatherData.main.humidity;
  //       noCloud = weatherData.clouds.all;
  //       cloud1 = imageURL;
  //     });
  //   });

  let time = today.toLocaleTimeString(option);

  let day = today.toLocaleDateString("en-US", options);

  res.render("weather", {location: location, weather_description: weather_description, temp: temp,
    country: country, day: day, windSpeed: windSpeed, humidity: humidity,
    noCloud: noCloud, time: time, cloud1: cloud1});
});

app.post("/", function(req, res){
    location = req.body.search;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=metric&appid=f2eda056a198e5b2eb9a97b5118cc450";
  https.get(url, function(response){
    statusCode = response.statusCode;
    console.log(statusCode);
    if(statusCode===200){
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        let icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        weather_description = weatherData.weather[0].description;
        location = weatherData.name;
        temp = weatherData.main.temp;
        country = weatherData.sys.country;
        windSpeed = weatherData.wind.speed;
        humidity = weatherData.main.humidity;
        noCloud = weatherData.clouds.all;
        cloud1 = imageURL;
      });
      res.redirect("/weather");
    }else{
      res.redirect("/failure");
    }
  });
});

app.get("/failure",function(req, res){
  res.render("failure");
});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 5000, function(){
  console.log("Server is running on port 5000.");
});
