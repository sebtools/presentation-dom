
application.register('cloner', class extends Stimulus.Controller {
	static targets = [ "source", "button" ];
	static values = {
		action: { type: String, default: "button:beforebegin" },
		singlify: String,
		pattern: { type: String, default: "" }
	}

	initialize() {

	}

	connect() {

		this.config();

	}

	config() {
		var oButton = this.buttonTarget;

		if ( oButton.hasAttribute("data-action") ) {
			//ToDo: Append cloner#clone if it doesn't exist.
		} else {
			oButton.setAttribute("data-action","cloner#clone");
		}

		if ( this.element.hasAttribute("data-cloner-action") ) {
			this.actionValue = this.element.getAttribute("data-cloner-action");
		}
		if ( this.element.hasAttribute("data-cloner-singlify") ) {
			this.singlifyValue = this.element.getAttribute("data-cloner-singlify");
		}
		if ( this.element.hasAttribute("data-cloner-pattern") ) {
			this.patternValue = this.element.getAttribute("data-cloner-pattern");
		}
		

	}

	busy(isBusy) {

		this.element.ariaBusy = isBusy;

	}

	clone() {
		var oButton = this.buttonTarget;
		var oSource = this.sourceTarget;
		var html = oSource.outerHTML;
		var oParent;
		var insertAction = "beforebegin";

		this.busy(true);

		// Replace all instances of "_1" followed by a word boundary with "_2"
		if ( this.patternValue.length ) {
			let regex = new RegExp(this.patternValue, "g")

			//html = html.replace(regex, "_2");
			//console.log('length: ' + this.sourceTargets.length + 1);
			html = this.replaceDigitsWithNumber(html,regex,this.sourceTargets.length + 1);
		}
		
		if ( this.actionValue.split(":").length == 2 ) {
			insertAction = this.actionValue.split(":")[1];
			if ( insertAction == "before" ) {
				insertAction = "beforebegin";
			}
			if ( insertAction == "after" ) {
				insertAction = "afterend";
			}
		}
		if ( this.actionValue.split(":")[0] == "source" ) {
			oParent = oSource;
		} else {
			oParent = oButton;
		}

		oParent.insertAdjacentHTML(insertAction, html);

		var inserted = this.sourceTargets[this.sourceTargets.length-1];

		if ( this.hasSinglifyValue && this.singlifyValue.length ) {
			//Just hiding the element while duplicates are removed.
			inserted.hidden = true;

			this.singlify(inserted);

			inserted.hidden = false;

		}

		this.busy(false);
		
		//In case any other code needs to respond to the addition of this element.
		this.dispatch('load', {
			cancelable: false,
			detail:{},
			target: inserted,
		});
		
	}

	removeDuplicates(element, selector) {
		var elements = element.querySelectorAll(selector);
		var firstInstance = true;

		// Iterate through the elements
		for ( var i = 0; i < elements.length; i++ ) {
			var element = elements[i];
			
			// Check if it's the first instance of the class
			if ( firstInstance ) {
				firstInstance = false; // Set to false for subsequent instances
			} else {
				// If not the first instance, remove the element
				element.parentNode.removeChild(element);
			}
		}
	}

	replaceDigitsWithNumber(str, regex, number) {
		/*
		return str.replace(regex, function(match, group1, group2) {
			// Check if the second capturing group contains only digits
			if (/^\d+$/.test(group2)) {
				return group1 + number; // Replace only the digits with the specified number
			} else {
				return match; // Keep the match unchanged
			}
		});
		*/
		return str.replace(regex, function() {
			//console.table(arguments);
			//console.log(arguments[1] + number);
			return arguments[1] + number;
			return arguments[1].replace(arguments[1],number);
		});
	}

	singlify(element) {
		var selectors = '.counsel,[data-showhide-show="hasAlias_1=Yes"]>div';
		var aSelectors = selectors.split(",");

		for ( var selector of aSelectors ) {
			this.removeDuplicates(element, selector);
		}
	}

})