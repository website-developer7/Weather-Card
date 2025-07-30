const apiKey = '644ac0fe05cf4e2ccae843e3c0f4a700';
const form = document.getElementById('city-form');
const input = document.getElementById('city-input');
const card = document.getElementById('weather-card');
const cityNameEl = document.getElementById('city-name');
const datetimeEl = document.getElementById('datetime');
const tempEl = document.getElementById('temperature');
const iconEl = document.getElementById('weather-icon');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');

let currentCity = '';

form.addEventListener('submit', e => {
    e.preventDefault();
    currentCity = input.value.trim();
    if (currentCity) {
        fetchAndDisplay();
        clearInterval(window.updateInterval);
        window.updateInterval = setInterval(fetchAndDisplay, 60000);
    }
});

async function fetchAndDisplay() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(currentCity)}&units=metric&lang=ar&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();

        cityNameEl.textContent = data.name;
        const now = new Date();
        datetimeEl.textContent = now.toLocaleDateString('ar-EG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        tempEl.textContent = Math.round(data.main.temp);
        windEl.textContent = data.wind.speed;
        humidityEl.textcontent = data.main.humidity;

        const weatherMain = data.weather[0].main.toLowerCase();
        let imgSrc = '';
        let cardBg = '';

        if (weatherMain.includes('cloud')) {
            imgSrc = './images/sunCloud.png';
            cardBg = 'var(--bg-card1)';
        } else if (weatherMain.includes('clear')) {
            const hours = new Date().getHours();
            if (hours >= 18 || hours <= 5) {
                imgSrc = './images/Moon.png';
                cardBg = 'var(--bg-card2)';
            } else {
                imgSrc = './images/Sun.png';
                cardBg = 'var(--bg-card1)';
            }
        } else if (weatherMain.includes('rain') || weatherMain.includes('hot') || data.main.temp >= 35) {
            imgSrc = './images/Sun.png';
            cardBg = 'var(--bg-card3)';
        } else {
            imgSrc = './images/sunCloud.png';
            cardBg = 'var(--bg-card1)';
        }

        iconEl.src = imgSrc;
        iconEl.alt = data.weather[0].description;

        card.style.background = cardBg;
        card.classList.remove('hidden');
    } catch (err) {
        alert('.لم أتمكن من جلب بيانات الطقس، تأكد من اسم المدينة');
    }
}