// This script handles the logic for the Moon Phase Tracker web app.
// It calculates the moon's phase for a given date and updates the UI.

// Define the date of a known new moon for calculation reference
const KNOWN_NEW_MOON_DATE = new Date('2000-01-06T18:14:00Z');
const LUNAR_CYCLE = 29.53058867; // The average length of a synodic month

/**
 * Calculates the moon's age in days for a given date.
 * @param {Date} date - The date to calculate the moon phase for.
 * @returns {number} The moon's age in days (0-29.53).
 */
function getMoonAge(date) {
    // Get the time difference in milliseconds
    const diffMs = date.getTime() - KNOWN_NEW_MOON_DATE.getTime();
    // Convert milliseconds to days
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    // Calculate moon age in days, using modulo to stay within one lunar cycle
    let moonAge = diffDays % LUNAR_CYCLE;
    // Handle negative values if the date is before the known new moon
    if (moonAge < 0) {
        moonAge += LUNAR_CYCLE;
    }
    return moonAge;
}

/**
 * Determines the moon phase and corresponding emoji/name based on its age.
 * @param {number} age - The moon's age in days.
 * @returns {{emoji: string, name: string}} The moon phase emoji and name.
 */
function getMoonPhase(age) {
    // Define the moon phases based on age thresholds (in days)
    const phases = [
        { threshold: 1.84566, name: "New Moon", emoji: "🌑" },
        { threshold: 5.53699, name: "Waxing Crescent", emoji: "🌒" },
        { threshold: 9.22831, name: "First Quarter", emoji: "🌓" },
        { threshold: 12.91963, name: "Waxing Gibbous", emoji: "🌔" },
        { threshold: 16.61096, name: "Full Moon", emoji: "🌕" },
        { threshold: 20.30228, name: "Waning Gibbous", emoji: "🌖" },
        { threshold: 23.99361, name: "Last Quarter", emoji: "🌗" },
        { threshold: 27.68493, name: "Waning Crescent", emoji: "🌘" },
        { threshold: 29.53058, name: "New Moon", emoji: "🌑" }
    ];

    // Find the correct phase based on the moon's age
    for (const phase of phases) {
        if (age <= phase.threshold) {
            return { emoji: phase.emoji, name: phase.name };
        }
    }
    return { emoji: "🌑", name: "New Moon" }; // Default
}

/**
 * Displays a moon phase in the UI.
 * @param {HTMLElement} emojiElement - The element for the emoji.
 * @param {HTMLElement} labelElement - The element for the label.
 * @param {Date} date - The date for the phase.
 */
function displayMoonPhase(emojiElement, labelElement, date) {
    const moonAge = getMoonAge(date);
    const phase = getMoonPhase(moonAge);
    emojiElement.textContent = phase.emoji;
    labelElement.textContent = phase.name;
}

// Display Today's Moon Phase
function displayTodayMoonPhase() {
    const today = new Date();
    const todayImage = document.getElementById('today-image');
    const todayLabel = document.getElementById('today-label');
    const todayDate = document.getElementById('today-date');
    displayMoonPhase(todayImage, todayLabel, today);
    todayDate.textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Display the Next 7 Days Forecast with a staggered fade-in animation
function displayNext7Days() {
    const forecastGrid = document.getElementById('forecast-grid');
    const forecastContainer = document.getElementById('forecast-container');
    const today = new Date();
    
    // Clear previous forecast
    forecastGrid.innerHTML = '';
    
    // Create an array of the next 7 days' data
    const forecastData = [];
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const moonAge = getMoonAge(date);
        const phase = getMoonPhase(moonAge);
        forecastData.push({ date, phase });
    }

    // Show the forecast container immediately
    forecastContainer.classList.remove('hidden');

    // Stagger the display of each forecast item
    forecastData.forEach((data, index) => {
        setTimeout(() => {
            // Create a container for each day's forecast
            const forecastItem = document.createElement('div');
            forecastItem.className = 'flex flex-col items-center';
            
            // Add the moon emoji
            const moonIcon = document.createElement('div');
            moonIcon.className = 'moon-icon glowing-shadow mb-1';
            moonIcon.textContent = data.phase.emoji;
            
            // Add the date label
            const dateLabel = document.createElement('div');
            dateLabel.className = 'text-xs md:text-sm font-light text-gray-400';
            dateLabel.textContent = data.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
            // Add the phase name label
            const phaseNameLabel = document.createElement('div');
            phaseNameLabel.className = 'text-sm md:text-base font-medium text-gray-200';
            phaseNameLabel.textContent = data.phase.name;

            // Append all elements to the forecast item
            forecastItem.appendChild(moonIcon);
            forecastItem.appendChild(dateLabel);
            forecastItem.appendChild(phaseNameLabel);
            
            // Append the forecast item to the grid
            forecastGrid.appendChild(forecastItem);

            // Trigger the fade-in effect
            setTimeout(() => {
                moonIcon.style.opacity = '1';
            }, 10); // Small delay to allow the element to be added to the DOM before transitioning
        }, index * 100); // Stagger the creation with a 100ms delay between each item
    });
}

// Event listener for the "Show Next 7 Days" button
document.getElementById('show-forecast-btn').addEventListener('click', () => {
    displayNext7Days();
    // Scroll to the forecast section
    document.getElementById('forecast-container').scrollIntoView({ behavior: 'smooth' });
});

// Initialize the app by displaying today's moon phase on load
displayTodayMoonPhase();
