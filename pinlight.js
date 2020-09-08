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
    lastTickedMsec: 0,

    prepareSprint: function() {
        this.remainSpanMsec = 10 * 1000;
        this.status = "cooldown";
    },

    startSprint: function() {
        if (this.status == "cooldown") {
            this.remainSpanMsec = 0;
        }
    },

    startCooldown: function() {
        this.remainSpanMsec = gConfig.cooldownSpanMin * 60 * 1000;
        this.status = "cooldown";
    },

    startTimer: function() {
        if (this.ticker == null) {
            this.lastTickedMsec = Date.now()
            this.ticker = window.setInterval(tickerFunc, 1000);
        }
    },

    pauseTimer: function() {
        if (this.ticker != null) {
            window.clearInterval(this.ticker);
            this.ticker = null;
        }
    },

    tick: function() {
        let timeNow = Date.now();
        this.remainSpanMsec -= timeNow - this.lastTickedMsec;
        this.lastTickedMsec = timeNow;

        if (this.remainSpanMsec <= 0) {
            if (this.status == "cooldown") {
                this.remainSpanMsec += gConfig.sprintSpanMin * 60 * 1000;
                this.status = "sprint";

                return true;
            } else {
                this.status = "oversprint";

                return true;
            }
        }

        return false;
    }
};

function onClickPause() {
    if (gStatus.ticker == null) {
        gStatus.startTimer();
        document.getElementById("button-pause").innerHTML = "=";
    } else {
        gStatus.pauseTimer();
        document.getElementById("button-pause").innerHTML = ">";
    }
}

function onClickSprint() {
    gStatus.startSprint();
}

function onClickCooldown() {
    gStatus.startCooldown();

    updateStatus();
    updateTimerElem();
}

function tickerFunc() {
    let isStatusChanged = gStatus.tick();

    if (isStatusChanged) {
        updateStatus();
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

gStatus.prepareSprint();
updateStatus();
updateSubjectElem();
updateTimerElem();
gStatus.startTimer();