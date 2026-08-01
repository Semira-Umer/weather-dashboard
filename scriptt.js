const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const forecast = document.getElementById("forecast");

const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "⛈️",
    71: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    95: "⛈️"
};

const weatherText = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Snow",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Showers",
    95: "Thunderstorm"
};

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        getWeather();
    }
});

async function getWeather(){

    const city = cityInput.value.trim();

    if(city===""){
        error.innerHTML="Please enter a city.";
        return;
    }

    loading.style.display="block";
    error.innerHTML="";
    forecast.innerHTML="";

    try{

        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);

        const geoData = await geoResponse.json();

        if(!geoData.results){
            throw new Error();
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        const data = await weatherResponse.json();

        cityName.innerHTML = location.name;
        temperature.innerHTML = Math.round(data.current.temperature_2m) + "°C";
        condition.innerHTML = weatherText[data.current.weather_code];
        humidity.innerHTML = data.current.relative_humidity_2m + "%";
        wind.innerHTML = data.current.wind_speed_10m + " km/h";
        weatherIcon.innerHTML = weatherIcons[data.current.weather_code];

        displayForecast(data.daily);

    }
    catch{

        error.innerHTML="City not found.";

    }
    finally{

        loading.style.display="none";

    }

}

function displayForecast(daily){

    forecast.innerHTML="";

    for(let i=1;i<=5;i++){

        const date = new Date(daily.time[i]);

        const day = date.toLocaleDateString("en-US",{
            weekday:"short"
        });

        forecast.innerHTML += `

        <div class="forecast-card">

            <h3>${day}</h3>

            <div class="icon">${weatherIcons[daily.weather_code[i]]}</div>

            <p class="temp">${Math.round(daily.temperature_2m_max[i])}°</p>

            <p>${Math.round(daily.temperature_2m_min[i])}°</p>

            <p>${weatherText[daily.weather_code[i]]}</p>

        </div>

        `;

    }

}

cityInput.value = "";
getWeather();