/*
Courier Controller

This controller allows data to be copied from one element to another.
The source element is the element that contains the data to be copied.
The source element can be an input, textarea, select, or any element with a value attribute.

The target element is the element that will receive the data.
The target element can be any element with a value attribute or innerHTML.

The controller can be used in two ways:


1. As a standalone controller that listens for events and copies data from sources to targets.

In this case, use data-action="courier#transmit" on the source element and data-courier-target="source" on the target element.

Example:
<div data-controller="courier">
	<input type="text" id="foo" data-courier-target="source" data-target-id="bar" data-action="courier#transmit">
</div>

<div id="bar"></div>

In this example, the value of the input element with the id "foo" will be copied to the div element with the id "bar".


2. As a data controller that copies data from a source to a target when a specific event is triggered.

In this case, use data-courier-event="event-name" on the controller element.

Example:
<div data-controller="courier" data-courier-event="custom-event">
	<div id="foo" data-courier-target="target" data-source-id="bar"></div>
</div>

<input type="text" id="foo">

When the custom-event is triggered, the controller will copy data from the source to the target.

*/

application.register('courier', class extends Stimulus.Controller {
	static targets = ["source","target"];

	initialize() {
		this.dispatch("initialized");
	}

	connect() {
		const method = this.update.bind(this);
		
		//Set up event listeners
		if ( this.element.dataset.courierEvent ) {
			const events = this.element.dataset.courierEvent.split(" ");
			events.forEach(event => {
				window.addEventListener(event, method);
			});
		}

		window.addEventListener("courier:update", method);

		this.dispatch("connected");
  	}

	disconnect() {
		const method = this.update.bind(this);
		
		//Remove event listeners
		if ( this.element.dataset.courierEvent ) {
			const events = this.element.dataset.courierEvent.split(" ");
			events.forEach(event => {
				window.removeEventListener(event, method);
			});
		}

		window.removeEventListener("courier:update", method);

		this.dispatch("disconnected");
  	}

	//Transmit data from source to target
	transmit(event) {
		const elem = event.currentTarget;

		//Only take action if the element is defined as a source or target
		if ( ! elem.dataset.courierTarget ) return;

		//If the element is a source, copy its value to the target
		if ( elem.dataset.courierTarget == "source" && elem.dataset.targetId ) {
			const target = document.getElementById(elem.dataset.targetId);
			if ( target ) {
				this.copy(elem,target);
			}
		}

		//If the element is a target, copy the value from the source
		if ( elem.dataset.courierTarget == "target" && elem.dataset.sourceId ) {
			const source = document.getElementById(elem.dataset.sourceId);
			if ( source ) {
				this.copy(source,elem);
			}
		}

	}

	//Update all targets with values from sources
	update() {

		//Update targets with values from sources
		this.targetTargets.forEach(target => {
			const sourceId = target.dataset.sourceId;
			if (!sourceId) return;
			
			const source = document.getElementById(sourceId);
			if (!source) return;
			
			this.copy(source,target);
		});

		//Update sources with values from targets
		this.sourceTargets.forEach(source => {
			const targetID = source.dataset.targetId;
			if (!targetID) return;
			
			const target = document.getElementById(targetID);
			if (!target) return;
			
			this.copy(source,target);
		});

	}

	//Copy value from source to target
	copy(source,target) {
		//Get value from value attribute, data-value attribute or innerHTML
		let value = source.value || source.dataset.value || source.innerHTML;

		this.setValue(target, value)
	}

	//Set value of target
	setValue(target, value) {
		if ( target.hasAttribute('value') ) {
			target.value = value;
		} else if (target.dataset.value !== undefined) {
			target.dataset.value = value;
		} else {
			target.innerHTML = value;
		}
	}

})