const apiKey = '5be15f27f180f07259d63b580db53929'; 

async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    if (!city) return;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=es`
        );

        if (!response.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const data = await response.json();

        // Actualizar la interfaz
        document.querySelector('.city').textContent = data.name;
        document.querySelector('.temperature').textContent =
            `${Math.round(data.main.temp)}°C`;
        document.querySelector('.description').textContent =
            data.weather[0].description;
        document.getElementById('humidity').textContent =
            `${data.main.humidity}%`;
        document.getElementById('wind').textContent =
            `${Math.round(data.wind.speed * 3.6)} km/h`;

        document.querySelector('.error').style.display = 'none';
    } catch (error) {
        document.querySelector('.error').style.display = 'block';
    }
}

// Buscar la ciudad
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});