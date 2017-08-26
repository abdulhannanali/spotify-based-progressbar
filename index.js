// Make use of EventEmitter afterwards
const ProgressBar = require('./progress-bar.js');

/**
 * Instance of Demo Class to call the Functions related 
 * to increasing the progress
 */
function Demo() {
    // Right now the ProgressBar is created for us, 
    // in future, there can be a dedicated demo to do this for us
    this.progressBar = new ProgressBar({
        selector: '.bar-goes-here',
        width: '190px',
        height: '6px',
        barColors: rainbowBarColors,
    });

    this.progressBar.setProgress(2.39213);
    
    this.progressLogValue = document.querySelector('.progress .value');
    this.completeLogValue = document.querySelector('.complete .value');

    /**
     * Controls for the progress within the JavaScript Application
     */
    this.progressControls = document.querySelectorAll('.progress-controls .control');

    // Attaching the change progress listener to all of the controls
    this.progressControls.forEach(element => {
        element.addEventListener('click', this.changeProgress.bind(this));        
    });

    // Listening for logs emitted from the event emitter with ProgressBar
    this.progressBar.on('updateprogress', this.progressListener.bind(this));
    this.progressBar.on('complete', this.completeListener.bind(this));

    // Calling for the first time with initial progress
    this.progressListener(this.progressBar.progress);
}

/*
 * Sets the progress in percentage
 */
Demo.prototype.progressListener = function (progress) {
    this.progressLogValue.textContent = progress + '%';
}

Demo.prototype.completeListener = function () {
    this.completeLogValue.textContent = 'Yes indeed';
}

/**
 * Sets the Value of complete Log
 */
Demo.prototype.setCompleteLog = function (event) {

}

/**
 * 
 */
Demo.prototype.progressEventHandler = function progressEventHandler() {

}

/**
 * Change progress of the function based on the click
 */
Demo.prototype.changeProgress = function (event) {
    event.preventDefault();
    const targetElement = event.target;
    this.progressBar.setProgress(parseInt(targetElement.textContent, 10));
}

/**
 * Custom function to display different barColors on different 
 * progress that's happening
 */
function rainbowBarColors(progress) {
    const DEFAULT_SPOTIFY_COLOR = '#1db954';
    const SECONDARY_COLOR = '#292929'

    if (progress === 0 || progress === 100) {
        return [ DEFAULT_SPOTIFY_COLOR, SECONDARY_COLOR];
    }

    const rainbowColor = "hsl(" + (360 * progress / 100) + ",80%,50%)"
    return [ rainbowColor, SECONDARY_COLOR ];
}


function initialLoad() {
    const demoInstance = new Demo();
    window.pb = demoInstance.progressBar;
}

initialLoad();