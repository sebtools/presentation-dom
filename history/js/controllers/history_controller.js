
application.register('history', class extends Stimulus.Controller {


	initialize() {

	}

	connect() {

		console.log("history loaded");

		this.config();

	}

	config() {


	}

	back() {
		console.log("history:back()");
		history.back();
	}

	forward() {
		console.log("history:forward()");
		history.forward();
	}

	go(event) {
		console.log("history:go()");

		if ( event.target.hasAttribute("data-history-goval") ) {
			history.go(event.target.getAttribute("data-history-goval"));
		} else {
			history.go();
		}

	}

})
