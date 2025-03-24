import { Application, Controller } from "../js/stimulus.js";

const startUp = (window) => {
	'use strict';
	window.application = Application.start()
	window.application.debug = true;
}

( window => startUp(window) )(window);

export { Application, Controller };
