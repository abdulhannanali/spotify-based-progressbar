/**
 * Making APIs more extensible by letting the API consumer 
 * extend the interfaces 
 * for own purpose.
 * 
 * Doing it by using callbacks at first within a ProgressBar
 * 
 * ProgressBar that contains an argument map
 * containing the following options
 * - width
 * - height
 * - selector
 * 
 * Displays a progress bar and based on the progress of the progress bar also allows
 * us to set the color of the bar
 */
const mitt = require('mitt').default;

const DEFAULT_PROGRESS_WIDTH = '90px';
const DEFAULT_PROGRESS_HEIGHT = '4px';

const DEFAULT_PRIMARY_COLOR = '#1db954';
const DEFAULT_SECONDARY_COLOR = '#292929';

const INITIAL_CONTAINER_STYLES = {};
const INITIAL_PROGRESS_BAR_FOREGROUND = {};
const INITIAL_PROGRESS_BAR_BACKGROUND = {};

function defaultBarColors() {
    return [ DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR ];
}

/**
 * Returns a valid selector for the passed argument
 * based on certain validations
 */
function getValidSelector(selector) {
    if (typeof selector === 'string') {
        const elem = document.querySelector(selector);
        if (!elem) {
            throw new Error('No element for the given `selector`', selector);
        }
        return elem;
    } else if (selector instanceof HTMLElement) {
        return selector;
    } else {
        throw new Error('`selector` is not of valid type', selector);
    }
}

function ProgressBar(options) {
    /*
     * Validation not important since defaults are there
     */
    this.width = options.width || DEFAULT_PROGRESS_WIDTH;
    this.height = options.height || DEFAULT_PROGRESS_HEIGHT;
    
    // this._emitter = mitt();
    // this.on   = this._emitter.on;
    // this.off  = this._emitter.off;
    // this.emit = this._emitter.emit;

    /**
     * Progress in percentage
     */
    this.progress = options.initialProgress || 0;

    /**
     * Callback for letting the developers change the color of par dynamiclly based on progress
     * 
     * function with barColor, accept a percentage and provide
     * an array of two colors primary and secondary
     */
    if (options.barColors) {
        /**
         * Method is private and is inaccessible from the outside
         */
        this._barColors = options.barColors;
    } else {
        this._barColors = defaultBarColors;
    }

    this.selector = getValidSelector(options.selector);

    this._attachEmitter();
    this.create();
}

/**
 * Method `create` creates the progress bar with the elements
 * that are required
 */
ProgressBar.prototype.create = function create() {
    const container = document.createElement('div');
    container.classList.add(['progress-bar']);

    /**
     * Container for the Progress Bar
     * Separate elements are found in the future using (querySelector)s
     */
    container.innerHTML = `
        <div class="progress-bar__bg">
            <div class="progress-bar__fg"></div>
        </div>
    `;

    const progressBarBg = container.querySelector('div.progress-bar__bg');
    const progressBarFg = container.querySelector('div.progress-bar__fg');

    /**
     * Add default styling here for the progress bar
     * to make them look beautiful when they first
     * appear on our front end
     */
    this.container = container;
    this.progressBarBg = progressBarBg;
    this.progressBarFg = progressBarFg;

    // Initialization to display the progress bar appropriately
    this._setSize();
    this.show(true);

    /** Initializes the progress specified or the default one */
    this.setProgress(this.progress);

    this.selector.appendChild(this.container);
}

/**
 * Attaches the EventEmitter to the progress bar
 */
ProgressBar.prototype._attachEmitter = function _attachEmitter() {
    const emitter = this.emitter = mitt();

    // Assigning all the emitter properties to emitter
    Object.assign(this, emitter);
}

/**
 * Sets the progress for ProgressBar
 */
ProgressBar.prototype.setProgress = function setProgress(progress) {
    this.progress = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    this.emitProgressEvents();

    this.progressBarFg.style.width = progress + '%';
    this.setProgressColors();
}

ProgressBar.prototype.emitProgressEvents = function progressEvents() {
    if (this.progress >= 100) { this.emit('complete'); }
    this.emit('updateprogress', this.progress);
}

/**
 * Sets the color for the progress bar
 */
ProgressBar.prototype.setProgressColors = function _setProgressColors() {
    const [ fgColor, bgColor ] = this._barColors(this.progress);
    
    this.progressBarFg.style.backgroundColor = fgColor;
    this.progressBarBg.style.backgroundColor = bgColor;
}

ProgressBar.prototype._setSize = function _setSize() {
    this.container.style.width = this.width;
    this.container.style.height = this.height;
}

/**
 * Toggles the display of the ProgressBar
 */
ProgressBar.prototype.show = function show (isVisible) {
    this.container.style.display = isVisible ? '' : 'none';
}

module.exports = ProgressBar;
