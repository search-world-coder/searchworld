// 1. Select elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityNameDisplay = document.getElementById('cityName');
const tempDisplay = document.getElementById('temperature');
const descriptionDisplay = document.getElementById('description');

// 2. Click Event
searchBtn.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    // Clear display while loading
    cityNameDisplay.textContent = "Loading...";
    tempDisplay.textContent = "--";
    descriptionDisplay.textContent = "";

    await fetchWeatherData(cityName);
});

// 3. Main Function to fetch everything
async function fetchWeatherData(city) {
    try {
        // Step A: Fetch Coordinates
        const geoUrl = `https://open-meteo.com{encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        // Check if city exists
        if (!geoData.results || geoData.results.length === 0) {
            alert('City not found. Try another city.');
            cityNameDisplay.textContent = "City Name";
            return;
        }

        // Extract first result safely
        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const displayName = `${location.name}, ${location.country || ''}`;

        // Step B: Fetch Weather using Coordinates
        const weatherUrl = `https://open-meteo.com{lat}&longitude=${lon}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Update the page with data
        if (weatherData.current_weather) {
            const current = weatherData.current_weather;
            cityNameDisplay.textContent = displayName;
            tempDisplay.textContent = `${current.temperature}°C`;
            descriptionDisplay.textContent = getWeatherDesc(current.weathercode);
        } else {
            alert('Weather data format error.');
        }

    } catch (error) {
        console.error('System Error:', error);
        alert('Connection failed. Please turn off your ad-blocker or VPN and try again.');
    }
}

// 4. Weather code interpreter
function getWeatherDesc(code) {
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        95: 'Thunderstorm'
    };
    return codes[code] || 'Unknown weather';
}
