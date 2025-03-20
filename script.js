const apiKey = '5be15f27f180f07259d63b580db53929'; // Reemplaza con tu API key de OpenWeatherMap

async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    if (!city) return;

    try {
        // Obtener clima actual
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=es`
        );

        if (!currentResponse.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const currentData = await currentResponse.json();

        // Obtener pronóstico
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=es`
        );
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentData);
        updateForecast(forecastData);

        document.querySelector('.error').style.display = 'none';
    } catch (error) {
        document.querySelector('.error').style.display = 'block';
    }
}

function updateCurrentWeather(data) {
    document.querySelector('.city').textContent = data.name;
    document.querySelector('.temperature').textContent =
        `${Math.round(data.main.temp)}°C`;
    document.querySelector('.description').textContent =
        data.weather[0].description;
    document.getElementById('humidity').textContent =
        `${data.main.humidity}%`;
    document.getElementById('wind').textContent =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    // Actualizar icono
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
}

function updateForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    // Obtener pronóstico para los próximos 3 días
    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
    ).slice(0, 3);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
                 alt="${day.weather[0].description}">
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
        `;
        forecastDiv.appendChild(forecastDay);
    });
}

// Permitir búsqueda con Enter
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});