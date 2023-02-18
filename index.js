let dateElement = document.querySelector("#date");
let currentTime = new Date();
let day = currentTime.getDay();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let ampm = hours >= 12 ? "pm" : "am";
hours = hours % 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? "0" + minutes : minutes;
let formattedTime = hours + ":" + minutes + " " + ampm;

dateElement.innerHTML = `${days[day]}, ${formattedTime}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML = `${forecastHTML} 
    <div class="col-1" style="text-align: center; padding: 5px; margin: 30px; margin-top: 10px; margin-bottom: 10px">
                  ${formatDay(forecastDay.time)}
                   <img 
                   src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                     forecastDay.condition.icon
                   }.png"
                   alt=""
                   width="36"
                   />
                   ${Math.round(forecastDay.temperature.maximum)}°
                   <div class="lower-tem">${Math.round(
                     forecastDay.temperature.minimum
                   )}°</div>
                </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(city) {
  let apiKey = "1b80baf3de41c148obta7e8509c2d194";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector("#your-city").innerHTML = response.data.city;

  fahrenheitTemperature = response.data.temperature.current;

  document.querySelector("#temperature").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.city);
}

function search(city) {
  let apiKey = "1b80baf3de41c148obta7e8509c2d194";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}
let searchContainer = document.querySelector("#search-container");

searchContainer.addEventListener("submit", handleSubmit);

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperature = temperatureElement.innerHTML;
  temperature = Number(temperature);
  temperatureElement.innerHTML = Math.round(
    ((fahrenheitTemperature - 32) * 5) / 9
  );
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

search("San Francisco");
