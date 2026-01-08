let inputBox = document.getElementById("inp");
let getWeatherBtn = document.getElementById("btn");
let weatherBox = document.getElementById("weather");
let errorBox = document.getElementById("error");

async function getWeather() {
  let city = inputBox.value.trim();
  weatherBox.textContent = "";
  errorBox.textContent = "";

  if (!city) {
    errorBox.textContent = "Please enter a city name!";
    return;
  }

  try {
    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    let geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      errorBox.textContent = "City not found!";
      return;
    }

    let { latitude, longitude, name, country } = geoData.results[0];


    let weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    let weatherData = await weatherRes.json();

    let temp = weatherData.current_weather.temperature;
    let wind = weatherData.current_weather.windspeed;

    
    weatherBox.innerHTML = `
      <h3>${name}, ${country}</h3>
      Temperature: <b>${temp}°C</b><br>
      Wind Speed: <b>${wind} km/h</b>
    `;
  } catch (err) {
    errorBox.textContent = "Error fetching data!";
    console.error(err);
  }
}

getWeatherBtn.addEventListener("click", getWeather);
