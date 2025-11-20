// Update Time
function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('time').textContent = time;
}

updateTime();
setInterval(updateTime, 60000);

// Console welcome message
console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cLukin Kirill - Digital Product Designer', 'font-size: 14px; color: #888;');

