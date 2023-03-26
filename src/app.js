// Displaying Current Date

function currentDate() {
  let now = new Date();
  let date = now.getDate();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[now.getMonth()];

  let year = now.getFullYear();

  let newDate = document.querySelector(".date");
  newDate.innerHTML = `${day}, ${date} ${month} ${year}`;
}
currentDate();

// Displaying Current Time

function currentTime() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  minute = minute < 10 ? "0" + minute : minute;
  let newTime = document.querySelector(".time");
  newTime.innerHTML = `${hour}:${minute} ${ampm}`;
}
currentTime();

// If The User Allow the Browser to Access the Location

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function getWeatherData(lat, lon) {
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      displayWeather(data);
    });
}

// If The User Use the Search Bar

let searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let city = searchInput.value;
    searchCity(city);
  }
});

function searchCity(city) {
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    });
}

// Displaying Current Weather Data

function displayWeather(data) {
  let city = data.city;
  let country = data.country;
  let temp = Math.round(data.temperature.current);
  let description = data.condition.description;
  let iconUrl = data.condition.icon_url;

  let location = document.querySelector(".location");
  location.innerHTML = `${city}, ${country}`;

  let weatherTemp = document.querySelector("#temp-display");
  weatherTemp.innerHTML = `${temp}°`;

  let weatherType = document.querySelector(".weather-type");
  weatherType.innerHTML = `${description}`;

  let weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.innerHTML = `<img src="${iconUrl}" alt="weather icon">`;
  
  getHourlyData(data.coordinates.latitude, data.coordinates.longitude);
  getForecastData(data.coordinates.latitude, data.coordinates.longitude);

}

// Hourly Forecast

function getHourlyData(lat, lon) {
  let api_key = "b0c0cd6e9ac2703bc8d9959f958dda57";
  let api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
  console.log(api_url);

  fetch(api_url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayHourly(data);
    });
}

function displayHourly(data) {
  let hourlyContainer = document.querySelector("#hourly-forecast");
  let hoursToShow = 6;
  hourlyContainer.innerHTML = "";
  
  for (let i = 0; i < hoursToShow; i++) {
    let hourly = data.list[i];
    let hourlyTemp = hourly.main.temp;
    let tempCelsius = Math.round(hourlyTemp);
    let hourlyIcon = hourly.weather[0].icon;
    let hourlyTime = new Date(hourly.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      let hourlyCard = document.createElement("div");
      hourlyCard.classList.add("forecast");

      hourlyCard.innerHTML = `
        <h6 class="forecast-time">${hourlyTime}</h6>
        <img src="https://openweathermap.org/img/wn/${hourlyIcon}.png" alt="weather icon" class="forecast-icon">
        <h6 class="forecast-temp">${tempCelsius}°</h6>
      `;
      hourlyContainer.appendChild(hourlyCard);
  }
}

// 5 Day Forecast 

function getForecastData(lat, lon) {
  let apiKey = "b03a640e5ef6980o4da35b006t5f2942";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayForecast(data.daily);
    }); 
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 5; i++) {
    const day = forecastData[i];

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("day");

    const date = new Date(day.time * 1000); 
    const dayOfWeek = daysOfWeek[date.getDay()]; 

    const iconUrl = day.condition.icon_url;
    const description = day.condition.description;

    const minTemp = Math.round(day.temperature.minimum);
    const maxTemp = Math.round(day.temperature.maximum);

    const forecastContent = `
      <h6 class="day-name">${dayOfWeek}</h6>
      <img src="${iconUrl}">
      <h6 class="day-weather">${description}</h6>
      <h6 class="day-temp">${minTemp}° / <strong>${maxTemp}°</stronng></h6>
      `;

    forecastCard.innerHTML = forecastContent;
    forecastContainer.appendChild(forecastCard);
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeatherData(lat, lon);

}

getLocation();

// Converting Temperature

function toggleTemperature() {
  const temperatureDisplay = document.getElementById("temp-display");
  const tempToggleLink = document.querySelector(".temp-toggle");
  const tempUnit = document.querySelector(".temp-unit");

  if (tempToggleLink.innerText === "| Convert to Fahrenheit") {
    // Convert Celsius to Fahrenheit
    const currentTemperature = parseFloat(temperatureDisplay.innerText);
    const fahrenheitTemperature = (currentTemperature * 9/5) + 32;
    temperatureDisplay.innerText = fahrenheitTemperature.toFixed(0) + "°";
    tempUnit.innerHTML = `Fahrenheit <a href="#" class="temp-toggle">| Convert to Celsius</a>`;
  } else {
    // Convert Fahrenheit to Celsius
    const currentTemperature = parseFloat(temperatureDisplay.innerText);
    const celsiusTemperature = (currentTemperature - 32) * 5/9;
    temperatureDisplay.innerText = celsiusTemperature.toFixed(0) + "°";
    tempUnit.innerHTML = `Celsius <a href="#" class="temp-toggle">| Convert to Fahrenheit</a>`;
  }

  // Add event listener to the new toggle link
  const newToggleLink = document.querySelector(".temp-toggle");
  newToggleLink.addEventListener("click", toggleTemperature);

  // Remove event listener from the old toggle link
  tempToggleLink.removeEventListener("click", toggleTemperature);
}

const tempToggleLink = document.querySelector(".temp-toggle");
tempToggleLink.addEventListener("click", toggleTemperature);

// Activities Carousel  

const carousel = document.querySelector('.activity-carousel');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const activities = document.querySelectorAll('.activity');

let currentSlide = 0;
const numSlides = activities.length;

prevBtn.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + numSlides) % numSlides;
  displaySlide();
});

nextBtn.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % numSlides;
  displaySlide();
});

function displaySlide() {
  activities.forEach((activity, index) => {
    if (index === currentSlide) {
      activity.style.display = 'flex';
    } else {
      activity.style.display = 'none';
    }
  });
}

displaySlide();

setInterval(() => {
  nextBtn.click();
}, 5000);