application.register('checkall', class extends Stimulus.Controller {
	static targets = ["all", "checkbox"];

	initialize() {

		this.dispatch("initialized");

	}

	connect() {

		this.config();

		//Attaching controller to object so we can call methods on it.
		this.element[this.identifier] = this;

		this.dispatch("connected");

	}

	config() {

		this.updateAllChecked();

		// Ensure the "all" target has a data-action attribute
		if ( !this.allTarget.hasAttribute("data-action") ) {
			this.allTarget.setAttribute("data-action", "change->checkall#toggleAll");
		}

	}

	disconnect() {

		this.dispatch("disconnected");

	}

	toggleAll() {

		this.dispatch("toggling");

		this.checkboxTargets.forEach(checkbox => {
			checkbox.checked = this.allTarget.checked;
			this.dispatch("checkboxToggled", { target: checkbox });
		});
		
		this.dispatch("toggled");
	}

	updateAllChecked() {
		this.allTarget.checked = this.checkboxTargets.every(checkbox => checkbox.checked);
	}

})