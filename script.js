const timerDisplay = document.querySelectorAll('.timer');
const hoursSelect = document.querySelector('select[name="hours"]');
const minutesSelect = document.querySelector('select[name="minutes"]');
const secondsSelect = document.querySelector('select[name="seconds"]');
const buttons = document.querySelectorAll('.buttons');

let totalSeconds = 0;
let interval = null;

// 1. Function to generate a "Beep" sound using the browser's synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'square'; // Classic digital "beep" sound
    oscillator.frequency.value = 880; // Frequency in Hz (High A)
    
    oscillator.start();
    // Fade out slightly to avoid clicking sounds
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}

// 2. The "Beep-Beep" Pattern (5 seconds total)
function startBeeping() {
    let count = 0;
    // This interval creates the "pulse" (On for 250ms, Off for 250ms)
    const beepInterval = setInterval(() => {
        playBeep(0.2); // Beep for 0.2 seconds
        count++;

        // 10 beeps at 500ms intervals = 5 seconds
        if (count >= 10) {
            clearInterval(beepInterval);
        }
    }, 500); 
}

function updateDisplay() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    timerDisplay[0].textContent = String(h).padStart(2, '0') + ":";
    timerDisplay[1].textContent = String(m).padStart(2, '0') + ":";
    timerDisplay[2].textContent = String(s).padStart(2, '0');
}

function startTimer() {
    // Resume audio context (Modern browsers require this after a user click)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (interval) return;

    if (totalSeconds === 0) {
        const hrs = parseInt(hoursSelect.value) || 0;
        const mins = parseInt(minutesSelect.value) || 0;
        const secs = parseInt(secondsSelect.value) || 0;
        totalSeconds = (hrs * 3600) + (mins * 60) + secs;
    }

    if (totalSeconds <= 0) return alert("Please set a time!");

    interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            interval = null;
            startBeeping(); // Trigger the 5-second beep-beep
        } else {
            totalSeconds--;
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}

function restartTimer() {
    pauseTimer();
    totalSeconds = 0;
    updateDisplay();
}

// Event Listeners
buttons[0].addEventListener('click', startTimer);
buttons[1].addEventListener('click', pauseTimer);
buttons[2].addEventListener('click', restartTimer);