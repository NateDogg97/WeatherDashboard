var button = document.getElementById('searchBtn');
var userInput = document.getElementById('locSearch');
var todaysDate = document.querySelector('.todaysDate');
var todaysTemp = document.querySelector('.todaysTemp');
var todaysWind = document.querySelector('.todaysWind');
var todaysHumid = document.querySelector('.todaysHumid');
var todaysUVIndex = document.querySelector('.todaysUVIndex');

button.addEventListener('click', btnGO);

// This function handles the search button. It stores the value to local storage and starts
// the fetch requests

function btnGO() {
       
    var locationName = String(userInput.value);
    locationName = locationName.trim();
    locationName = locationName.charAt(0).toUpperCase() + locationName.slice(1);
    console.log(locationName);

    geocodingAPI(locationName);
    storeHistory(locationName);
};

// This function gets the longitude and latitude of the most popular city that matches
// the search value

function geocodingAPI(locationName) {
    var LONGLATurl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=1&appid=7bdaf7d35d6463a5a9236b225cf80e4a';

    const geoData = fetch(LONGLATurl)

        .then(function (response) {
            return response.json();
        })

        .then((data) => {
            console.log(data);
            return [data[0].lat, data[0].lon];
        });

    const giveLongLats = () => {
        geoData.then((a) => {
            currentAPI(a[0], a[1]);
        });
    };

    giveLongLats();
};

// This function is separated for organization. It simply takes the latitude and longitude
// and return weather data that I can use later on

function currentAPI(Lat, Lon) {

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + Lat + '&lon=' + Lon + '&exclude=minutely,hourly,alerts&appid=7bdaf7d35d6463a5a9236b225cf80e4a';

    const cityWeather = fetch(currentURL)

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log(data);
            
            fillBlanks(data); // Here I am calling for the page to be populated
            fillCards(data);  // ----------------------------------------------
        });

};

// This function fills the main section with todays weather data and also handles the UV index

function fillBlanks(data) {

    var a = String(userInput.value);
    document.querySelector('#todaysForecast').style = 'visibility: visible';
    document.querySelector('#cards').style = 'visibility: visible';

    todaysWind.textContent = data.current.wind_speed + ' Mph';
    todaysTemp.textContent = Math.round(kelvinToF(data.current.temp)) + ' F';
    todaysHumid.textContent = data.current.humidity + ' %';
    todaysDate.textContent = a.charAt(0).toUpperCase() + a.slice(1) + ' ' + moment(data.current.dt).format('dddd, MMMM Do');
    $('#img').attr('src', displayImg(data.current.weather.icon));

// This conditional handles the UV Index color    

    if (data.current.uvi < 3){
        todaysUVIndex.textContent = data.current.uvi;
        $('.todaysUVIndex').attr('background-color', 'green')
    } else if (data.current.uvi >= 3 && data.current.uvi <= 5){
        todaysUVIndex.textContent = data.current.uvi;
        $('.todaysUVIndex').attr('background-color', 'yellow')
    } else if ((data.current.uvi > 5 && data.current.uvi <= 7)) {
        todaysUVIndex.textContent = data.current.uvi;
        $('.todaysUVIndex').attr('background-color', 'orange')
    } else {
        todaysUVIndex.textContent = data.current.uvi;
        $('.todaysUVIndex').attr('background-color', 'red')
    }
}

// A simple function that helps me convert from kelvin to Fahrenheit

function kelvinToF(number) {
    return 1.8 * (number - 273) + 32
}

// Here I use Jquery to keep this portion clean. I have to use multiple loops to fill 
// each <li> with the correct data

function fillCards(data) {

    $('.cardTemp').each(function(i){
        $(this).text(Math.round(kelvinToF(data.daily[i+1].temp.day)) + ' F');
    })

    $('.cardWind').each(function(i){
        $(this).text(data.daily[i+1].wind_speed + ' Mph');
    })

    $('.cardHumid').each(function(i){
        $(this).text(data.daily[i+1].humidity + ' %');
    })

    $('.img').each(function(i){
        $(this).attr('src', displayImg(data.daily[i+1].weather.icon));
    })

// This part was tricky because I had to use the add.() method through moment.js to display
// the dates properly

    $('.card-title').each(function(i){
        ($(this).text(moment(data.daily.dt).add(i+1, 'day').format('ddd, MMM Do')));
    })

}

// This function handles the icon using conditionals

function displayImg(icon) {
    
    var img ='';

    if (icon === '01d') {
        img = 'http://openweathermap.org/img/wn/01d.png';
    } else if (icon === '01n') {
        img = 'http://openweathermap.org/img/wn/01n.png';
    } else if (icon === '02d') {
        img = 'http://openweathermap.org/img/wn/02d.png';
    } else if (icon === '02n') {
        img = 'http://openweathermap.org/img/wn/02n.png';
    } else if (icon === '03d' || '03n') {
        img = 'http://openweathermap.org/img/wn/03d.png';
    } else if (icon === '04d' || '04n') {
        img = 'http://openweathermap.org/img/wn/04d.png';
    } else if (icon === '09d' || '09n') {
        img = 'http://openweathermap.org/img/wn/09d.png';
    } else if (icon === '10d' || '10n') {
        img = 'http://openweathermap.org/img/wn/10d.png';
    } else if (icon === '11d' || '11n') {
        img = 'http://openweathermap.org/img/wn/11d.png';
    } else if (icon === '13d' || '13n') {
        img = 'http://openweathermap.org/img/wn/13d.png';
    } else {
        img = 'http://openweathermap.org/img/wn/50d.png'
    }

    return img
}

// Here I am creating an array and populating it with the values stored in the 'city' key.
// I can run a few conditionals to limit the seach history. This bit could be improved.

function storeHistory(input){

    var a = [];

    a = JSON.parse(localStorage.getItem('city')) || [];

    if (a.indexOf(input) !== -1 || a.length > 5 || input == ""){
        return

    } else {
        a.push(input);
    }

    localStorage.setItem('city', JSON.stringify(a));

}

// Here I use a for loop to create the search history buttons by accessing local storage

function buildHistoryButtons() {

    var a = [];

    a = JSON.parse(localStorage.getItem('city')) || [];

    for (var i=0; i<a.length; i++){

        var hbutton = document.createElement('button');
        hbutton.setAttribute('type', 'button');
        hbutton.setAttribute('class', 'btn btn-secondary');
        hbutton.setAttribute('name', a[i])
        hbutton.style = 'margin-top:15px;';
        document.querySelector('#historyBtns').append(hbutton);

        hbutton.textContent = a[i];
    }

}

buildHistoryButtons();

// Here I needed to create a seperate section to make sure the dynamically created buttons were
// functioning properly

const historyButtons = document.querySelector('#historyBtns')

historyButtons.addEventListener('click', function(e){
    if (e.target.classList.contains('btn-secondary')){
        userInput.value = e.target.name;
        geocodingAPI(e.target.name);
    }
})