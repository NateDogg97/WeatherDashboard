var button = document.getElementById('searchBtn');
var userInput = document.getElementById('locSearch');
var todaysDate = document.querySelector('.todaysDate');
var todaysTemp = document.querySelector('.todaysTemp');
var todaysWind = document.querySelector('.todaysWind');
var todaysHumid = document.querySelector('.todaysHumid');
var todaysUVIndex = document.querySelector('.todaysUVIndex');
button.addEventListener('click', btnGO);

function btnGO() {

    locationName = String(userInput.value);
    console.log(locationName);

    geocodingAPI(locationName);

};

function geocodingAPI(locationName) {
    var LONGLATurl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + locationName + '&limit=1&appid=7bdaf7d35d6463a5a9236b225cf80e4a';

    //Write our fetch request function as an expression
    const geoData = fetch(LONGLATurl)

        .then(function (response) {
            return response.json();
        })

        //We now have the LATITUDE and LOGITUDE of our city
        .then((data) => {
            console.log(data); //See the data from the Geocoding API
            return [data[0].lat, data[0].lon];
        });

    //Takes those Coords and passes those coords to the current weather API
    const giveLongLats = () => {
        geoData.then((a) => {
            currentAPI(a[0], a[1]);
        });
    };

    //Fires off the giveLongLats func
    giveLongLats();
};

function currentAPI(Lat, Lon) {

    var currentURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + Lat + '&lon=' + Lon + '&exclude=minutely,hourly,alerts&appid=7bdaf7d35d6463a5a9236b225cf80e4a';

    //Makes the fetch current weather function an expression that is manipulatable
    const cityWeather = fetch(currentURL)

        .then(function (response) {
            return response.json();
        })

        //We now have the current weather data as the variable 'data'
        .then(function (data) {
            console.log(data); //See data from the OneCall API
            
            fillBlanks(data);
            fillCards(data);
        });

};

function fillBlanks(data) {

    var a = String(userInput.value)

    todaysWind.textContent = data.current.wind_speed + ' Mph';
    todaysTemp.textContent = Math.round(kelvinToF(data.current.temp)) + ' F';
    todaysHumid.textContent = data.current.humidity + ' %';
    todaysDate.textContent = a.charAt(0).toUpperCase() + a.slice(1) + ' ' + moment(data.current.dt).format('dddd, MMMM Do');
    $('#img').attr('src', displayImg(data.current.weather.icon));
    
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

function kelvinToF(number) {
    return 1.8 * (number - 273) + 32
}

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

    $('.card-title').each(function(i){
        ($(this).text(moment(data.daily.dt).add(i+1, 'day').format('ddd, MMM Do')));
    })

}

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