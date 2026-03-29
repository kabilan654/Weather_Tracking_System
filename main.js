//Admin user id and their password
var admin_id={admin1:"admin123",admin2:"admin123",admin3:"admin123",admin4:"admin123",admin5:"admin123"};

//Function to validate the authentic admin
function validAdmin(){
    var username=document.getElementById("adminname").value;
    var password=document.getElementById("adminpass").value;
    if(username in admin_id){
        if(admin_id[username]===password){
            sessionStorage.setItem("currentAdmin",username);
            window.location.href="adminhome.html";
            return false;
        }
        else{
            alert("INVALID PASSWORD");
            return false;
        }
    }
    else{
        alert("ADMIN ID DOESN'T EXIST");
        return false;
    }
}

//User user id and their password
if(sessionStorage.getItem("userDetails")==null){
    var user_id={user1:"user123"};
    sessionStorage.setItem("userDetails",JSON.stringify(user_id));
}

//Fuction to return the user id and password as object
function returnUserID(){
    return JSON.parse(sessionStorage.getItem("userDetails")); 
}

//Function to validate the authentic user
function validUser(){
    var user_id=returnUserID();
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if(username in user_id){
        if(user_id[username]===password){
            sessionStorage.setItem("currentUser",username);
            window.location.href="home.html";
            return false;
        }
        else{
            alert("INVALID PASSWORD");
            return false;
        }
    }
    else{
        alert("USERNAME DOESN'T EXIST");
        return false;
    }
}

//Function to add new user
function validNewUser(){
    var user_id=returnUserID();
    var username=document.getElementById("newuser").value;
    var password1=document.getElementById("password1").value;
    var password2=document.getElementById("password2").value;
    if(username in user_id){
        alert("USERNAME ALREADY EXIST");
        return false;
    }
    else{
        if(password1===password2){
            user_id[username]=password1;
            sessionStorage.setItem("userDetails",JSON.stringify(user_id));
            return true;
        }
        else{
            alert("PASSWORD DOESN'T MATCH");
            return false;
        }
    }
}

//Function to greet user
function greet(){
    var user=sessionStorage.getItem("currentUser");
    if(user){
        document.getElementById("greetuser").innerHTML="Welcome, "+user;
    }
}

if(document.getElementById("greetuser")){
    greet();
}

//Function to greet admin
function greetAdmin(){
    var admin=sessionStorage.getItem("currentAdmin");
    if(admin){
        document.getElementById("greetadmin").innerHTML="Welcome, "+admin;
    }
}

if(document.getElementById("greetadmin")){
    greetAdmin();
}

//Function to make the city inside search bar
function pref(city){
    var c=document.getElementById("search");
    c.value=city;
}

//Function to add preference
function addPref(){
    var user=sessionStorage.getItem("currentUser");
    var city=document.getElementById("search").value;
    var userPref=sessionStorage.getItem("userPref");
    if(userPref==null){
        var obj={};
        obj[user]=[city];
        sessionStorage.setItem("userPref",JSON.stringify(obj));
        displayPref(user);
        return;
    }
    var userpreference=JSON.parse(userPref);
    if(userpreference[user]==null){
        userpreference[user]=[city];
    }
    else if(!userpreference[user].includes(city)){
        userpreference[user].push(city);
    }
    else{
        alert("PREFERENCE ALREADY EXIST");
        return;
    }
    sessionStorage.setItem("userPref",JSON.stringify(userpreference));
    displayPref(user);
}

//Function to display preference
function displayPref(user){
    var userPref=JSON.parse(sessionStorage.getItem("userPref")) || {};
    if(userPref[user] && userPref[user].length!=0){
        var parent=document.getElementById("output");
        parent.innerHTML="";
        for(let i=0;i<userPref[user].length;i++){
            var child=document.createElement("li");
            child.innerHTML=userPref[user][i];
            parent.appendChild(child);
        }
    }
}

//Fuction to display preference when the user is entering
window.onload=function(){
    var user=sessionStorage.getItem("currentUser");
    if(user){
        displayPref(user);
    }
}

//Function to add weather
function addWeather(){
    var date=document.getElementById("date").value;
    var today=new Date().toISOString().split("T")[0];
    if(date!==today){
        alert("You can only add today's weather");
        return;
    }
    var city=document.getElementById("cityname").value;
    var temp=document.getElementById("temperature").value;
    var humidity=document.getElementById("humidity").value;
    var wind=document.getElementById("wind").value;
    var weather=document.querySelector('input[name="weather"]:checked').value;
    var weatherData=sessionStorage.getItem("weatherData");
    if(weatherData==null){
        weatherData={};
    }
    else{
        weatherData=JSON.parse(weatherData);
    }
    var key=city+"_"+date;
    if(weatherData[key]){
        alert("Weather already entered for today");
        return;
    }
    weatherData[key]={
        city:city,
        date:date,
        temperature:temp,
        humidity:humidity,
        wind:wind,
        condition:weather
    };
    sessionStorage.setItem("weatherData",JSON.stringify(weatherData));
    alert("Weather Added Successfully");
    document.getElementById("weatherForm").reset();
}

//Function to sign out
function signOut(){
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentAdmin");
    window.location.href="index.html";
}

//Function to show weather
function showWeather(){
    var user=sessionStorage.getItem("currentUser");
    var userPref=sessionStorage.getItem("userPref");
    var weather=sessionStorage.getItem("weatherData");
    var output=document.getElementById("output");
    output.innerHTML="";
    if(userPref==null){
        output.innerHTML="<h3>No Preferences Added</h3>";
        return;
    }
    userPref=JSON.parse(userPref);
    if(userPref[user]==null||userPref[user].length==0){
        output.innerHTML="<h3>No Preferences Added</h3>";
        return;
    }
    if(weather!=null){
        weather=JSON.parse(weather);
    }
    else{
        weather={};
    }
    var today=new Date().toISOString().split("T")[0];
    var cities=userPref[user];
    for(var i=0;i<cities.length;i++){
        var city=cities[i];
        var key=city+"_"+today;
        if(weather[key]){
            var data=weather[key];
            var img=getWeatherImage(data.condition);
            output.innerHTML+=
            '<div class="weatherCard">'+
            '<img src="'+img+'">'+
            '<h3>'+data.city+'</h3>'+
            '<p>Date : '+data.date+'</p>'+
            '<p>Temp : '+data.temperature+' °C</p>'+
            '<p>Humidity : '+data.humidity+'%</p>'+
            '<p>Wind : '+data.wind+' km/h</p>'+
            '<p class="condition">'+data.condition+'</p>'+
            '</div>';
        }
        else{
            output.innerHTML+=
            '<div class="weatherCard notUpdated">'+
            '<img src="images/notupdated.png">'+
            '<h3>'+city+'</h3>'+
            '<p class="notText">Weather Not Updated</p>'+
            '</div>';
        }
    }
}

//Fuction to generate image
function getWeatherImage(type){
    if(type=="Sunny")return "images/sunny.jpg";
    if(type=="Rainy")return "images/rainy.png";
    if(type=="Cloudy")return "images/cloudy.jpg";
    if(type=="Windy")return "images/windy.jpg";
    if(type=="Stormy")return "images/storm.jpg";
    return "images/default.png";
}