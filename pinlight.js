// configurations
gConfig = {
    subject: "test subject",
    sprintSpanMin: 1,
    cooldownSpanMin: 1
};

// status
gStatus = {
    remainSpanMsec: 0,
    status: "cooldown",

    ticker: null,
    lastTickedMsec: 0
};

function onClickPause() {
    if (gStatus.ticker == null) {
        startTimer();
        document.getElementById("button-pause").innerHTML = "=";
    } else {
        pauseTimer();
        document.getElementById("button-pause").innerHTML = ">";
    }
}

function onClickSprint() {
    gStatus.remainSpanMsec = 0;
}

function onClickCooldown() {
    gStatus.remainSpanMsec = gConfig.cooldownSpanMin * 60 * 1000;
    gStatus.status = "cooldown";
    updateStatus();
    updateTimerElem();
}

// initSprint() sets current timer to 10 seconds cooldown before sprint begins.
function initSprint() {
    gStatus.remainSpanMsec = 10 * 1000;
    gStatus.status = "cooldown";
}

function pauseTimer() {
    if (gStatus.ticker != null) {
        window.clearInterval(gStatus.ticker);
        gStatus.ticker = null;
    }
}

function startTimer() {
    if (gStatus.ticker == null) {
        gStatus.lastTickedMsec = Date.now()
        gStatus.ticker = window.setInterval(tickerFunc, 1000);
    }
}

function tickerFunc() {
    let timeNow = Date.now();
    gStatus.remainSpanMsec -= timeNow - gStatus.lastTickedMsec;
    gStatus.lastTickedMsec = timeNow;

    if (gStatus.remainSpanMsec <= 0) {
        if (gStatus.status == "cooldown") {
            gStatus.remainSpanMsec += gConfig.sprintSpanMin * 60 * 1000;
            gStatus.status = "sprint";
            updateStatus();
        } else {
            gStatus.status = "oversprint";
            updateStatus();
        }
    }

    updateTimerElem();
}

function updateSubjectElem() {
    document.getElementById("subject").innerHTML = gConfig.subject
}

function updateTimerElem() {
    let timeValueSec = gStatus.remainSpanMsec / 1000;
    let isOvertime = false;
    if (timeValueSec < 0) {
        timeValueSec = timeValueSec * -1;
        isOvertime = true;
    }

    let timePartHour = Math.floor(timeValueSec / 60 / 60);
    let timePartMin = Math.floor(timeValueSec / 60);
    let timePartSec = Math.floor(timeValueSec % 60);

    let strHour = timePartHour.toString()
    if (strHour.length == 1) {
        strHour = "0" + strHour;
    }
    let strMin = timePartMin.toString()
    if (strMin.length == 1) {
        strMin = "0" + strMin;
    }
    let strSec = timePartSec.toString()
    if (strSec.length == 1) {
        strSec = "0" + strSec;
    }

    var timeStr = strHour + ':' + strMin + ':' + strSec;
    if (isOvertime) {
        timeStr = '+' + timeStr;
    }
    document.getElementById("timer").innerHTML = timeStr;
}

function updateStatus() {
    bodyElem = document.body

    switch (gStatus.status) {
        case "cooldown":
            document.getElementById("button-sprint").style.display = "block";
            document.getElementById("button-cooldown").style.display = "none";
            document.body.setAttribute("class", "cooldown");
            break;
        case "sprint":
            document.getElementById("button-sprint").style.display = "none";
            document.body.setAttribute("class", "sprint");
            break;
        case "oversprint":
            document.getElementById("button-cooldown").style.display = "block";
            document.body.setAttribute("class", "oversprint");
            break;
    }
}

initSprint();
updateStatus();
updateSubjectElem();
updateTimerElem();
startTimer();