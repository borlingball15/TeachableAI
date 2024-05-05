// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/q_bXBcmfTJM

let lang = navigator.language || 'en-US';
let speechRec = new p5.SpeechRec(lang, gotSpeech);

let continuous = true;
let interim = false;

document.getElementById('pickWord').addEventListener('click', function() {
    speechRec.start(continuous, interim);
});

document.getElementById('stopSpeech').addEventListener('click', function() {
    speechRec.stop();
});

function gotSpeech() {
    if (speechRec.resultValue) {
        document.getElementById('spokenWord').innerText = speechRec.resultString;
    }

    let spokenWordElement = document.getElementById("spokenWord");
    spokenWordElement.style.fontSize = "70px"; // Adjust the font size as needed
}

document.getElementById('stopSpeech').addEventListener('click', function() {
    let spokenWord = document.getElementById('spokenWord').innerText;
    localStorage.setItem('spokenWord', spokenWord);
});

document.getElementById('stopSpeech').addEventListener('click', function() {
    let spokenColor = document.getElementById('spokenColor').innerText;
    localStorage.setItem('spokenColor', spokenColor);
});
