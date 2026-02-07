const config = window.pomodoroConfig;

const startTotalSeconds = (config.minutes * 60) + config.seconds;
const restTime = config.restTime * 60;
const mode = {
    focus: 0,
    rest: 1
};


let currentMode = config.currentMode;
let totalSeconds = startTotalSeconds;
let timerInterval = null;
let isRunning = false;

const statusBadge = document.getElementById("status-badge");
const btnIniciar = document.getElementById("btn-iniciar");

function tick() {
    totalSeconds--;
    updateDisplay();

    if (totalSeconds <= 0) {
        handlerTimerComplete();
        return;
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    btnIniciar.disabled = true;

    if (currentMode === mode.focus) {
        updateStatusVisual(config.texts.focusing, "bg-primary");
    } else {
        updateStatusVisual(config.texts.resting, "bg-success");
    }

    timerInterval = setInterval(tick, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    btnIniciar.disabled = false;
    updateStatusVisual(config.texts.paused, "bg-warning");
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    btnIniciar.disabled = false;

    currentMode = mode.focus;
    changeTheme();
    totalSeconds = startTotalSeconds;

    updateDisplay();
    updateStatusVisual(config.texts.ready, "bg-secondary");
}

function handlerTimerComplete() {
    clearInterval(timerInterval);
    isRunning = false;
    btnIniciar.disabled = false;
    const audio = document.getElementById("audio-alarm");
    if (audio) {
        audio.play().catch(error => console.log("Somenthing went wrong: ", error));
    }

    if (currentMode === mode.focus) {
        fetch(config.urls.finishEndpoint, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Foco registrado. Total: " + data.totalFocos);
                }
            })
            .catch(error => console.error('Erro ao salvar:', error));

        currentMode = mode.rest;
        changeTheme();
        totalSeconds = restTime;
        updateDisplay();
        updateStatusVisual(config.texts.restTime, "bg-success");

        setTimeout(() => alert(config.texts.alertRest), 500);
    }
    else {
        currentMode = mode.focus;
        changeTheme();
        totalSeconds = startTotalSeconds;
        updateDisplay();
        updateStatusVisual(config.texts.ready, "bg-secondary");
        setTimeout(() => alert(config.texts.alertWork), 500);
    }
}

function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes < 10 ? "0" + minutes : minutes;
    const ss = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer-display").innerText = `${mm}:${ss}`;
    document.title = `${mm}:${ss} - Pomodoro`;
}

function updateStatusVisual(text, cssClass) {
    statusBadge.innerText = text;
    statusBadge.classList.remove("bg-primary", "bg-secondary", "bg-success", "bg-warning", "bg-danger");
    statusBadge.classList.add(cssClass);
}

function changeTheme() {
    document.body.classList.remove('theme-focus', 'theme-rest');
    if (currentMode === mode.focus) {
        document.body.classList.add('theme-focus');
    } else {
        document.body.classList.add('theme-rest');
    }
}
changeTheme();