const API_KEY = '0c46449184e302ac01c42aefe3cf1c24'; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const city = document.getElementById('city').value;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);

        const [currentWeatherData, forecastData] = await Promise.all([
            currentWeatherResponse.json(),
            forecastResponse.json(),
        ]);

        if (currentWeatherResponse.ok && forecastResponse.ok) {
            displayWeatherData(currentWeatherData, forecastData);
        } else {
            alert("Error fetching weather data. Please check the city name.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayWeatherData(currentWeatherData, forecastData) {
    const weatherData = document.getElementById("weatherData");
    const temperatureC = currentWeatherData.main.temp.toFixed(1);
    const temperatureF = ((temperatureC * 9) / 5 + 32).toFixed(1);
    const weatherDescription = currentWeatherData.weather[0].description;
    const cityName = currentWeatherData.name;
    const country = currentWeatherData.sys.country;
    const iconCode = currentWeatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const forecastItems = forecastData.list.slice(0, 8).map((item) => {
        const date = new Date(item.dt * 1000);
        const hour = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const tempC = item.main.temp.toFixed(1);
        const tempF = ((tempC * 9) / 5 + 32).toFixed(1);
        const forecastIconCode = item.weather[0].icon;
        const forecastIconUrl = `https://openweathermap.org/img/wn/${forecastIconCode}.png`;
        return `
            <div class="forecast-item">
                <p>${hour}</p>
                <img src="${forecastIconUrl}" alt="${item.weather[0].description}" onload="applyFilterToClearSkyIcon(this)">
                <p>${tempC}°C / ${tempF}°F</p>
            </div>
        `;
    }).join("");

    weatherData.innerHTML = `
        <h2>${cityName}, ${country}</h2>
        <div class="current-weather">
            <h3>${temperatureC}°C / ${temperatureF}°F</h3>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
        </div>
        <div class="forecast">
            ${forecastItems}
        </div>
    `;
}

function applyFilterToClearSkyIcon(iconElement) {
    if (iconElement.src.includes('01d') || iconElement.src.includes('01n')) {
        iconElement.classList.add('filtered-icon');
    }
}
