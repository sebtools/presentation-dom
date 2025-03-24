application.register('options', class extends Stimulus.Controller {
	static targets = [];

	initialize() {

		this.dispatch("initialized");

	}

	connect() {

		this.config();

		//Attaching controller to object so we can call methods on it.
		this.element[this.identifier] = this;
		
		this._runWaitingCode(
			() =>  this.setUp()
		);

		this.dispatch("connected");

	}

	disconnect() {

		this.dispatch("disconnected");

	}

	config() {

	}

	setUp() {
		if ( this.element.hasAttribute("data-options-source") && document.querySelector(this.element.getAttribute("data-options-source")) ) {
			this.source = document.querySelector(this.element.getAttribute("data-options-source"));
		}
	}

	busy(isBusy) {
		this.element.ariaBusy = isBusy;
	}

	getColumnData(colIndex) {
		return this.getData(`td:nth-child(${colIndex + 1})`);
	}

	getData(selector) {
		return Array.from(document.querySelectorAll(selector))
			.map(elem => {
				let label = elem.textContent.trim();
				let value = elem.getAttribute("data-value") || 
							(elem.querySelector("data")?.getAttribute("value")) || 
							label;
	
				return { label, value };
			});
	}
	
	getObjOptions(obj) {
		obj = this._getObj(obj);

		
	}

	_getColumnData(colIndex) {
		return Array.from(document.querySelectorAll(`td:nth-child(${colIndex + 1})`))
			.map(td => {
				let dataElement = td.querySelector("data");
				let label = td.textContent.trim();
				let value = dataElement ? dataElement.getAttribute("value") : label;
				
				return { label, value };
			});
	}

	_getItemParentIndex(obj) {
		obj = this._getObj(obj);
	
		// If obj is still not valid or has no parent, return -1
		if ( !obj || !obj.parentElement ) return -1;
	
		return Array.from(obj.parentElement.children).indexOf(obj);
	}

	_getObj(obj) {
		// If obj is a string, try to select the element
		if ( typeof obj === "string" ) {
			obj = document.querySelector(obj);
		}

		return obj;
	}

})