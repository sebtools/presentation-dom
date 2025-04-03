application.register('pivottable', class extends Stimulus.Controller {
	static targets = ["table"];

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
		this.build();
		this._addMutationListeners();
	}

	disconnect() {

		// Remove the mutation observer when the controller is disconnected
		if ( this.observer ) {
			this.observer.disconnect();
		}

		this.dispatch("disconnected");

	}

	build() {
		this.dispatch("building");
		this.busy(true);

		this.buildPivotTable();

		this.busy(false);
		this.dispatch("built");

	}
	
	busy(isBusy) {

		// Add or remove identifier from busywith attribute to indicate that the element is busy with this controller
		if ( isBusy ) {
			this.element.dataset.busywith = (this.element.dataset.busywith || '') + ' ' + this.identifier;
		} else {
			this.element.dataset.busywith = (this.element.dataset.busywith || '').replace(this.identifier, '').trim();
		}

		// Set aria-busy attribute to indicate that the element is doing anything
		this.element.ariaBusy = ( this.element.dataset.busywith.length > 0 );

	}

	buildPivotTable() {
		let controller = this.element;
		let sourceTable = this.getSourceTable();

		if ( !sourceTable ) {
			console.error(`Source table with ID "${sourceTableId}" not found.`);
			return;
		}

		let groupColumns = controller.getAttribute("data-pivottable-group").split(",");
		let sortColumn = controller.getAttribute("data-pivottable-sort");
		let dataField = controller.getAttribute("data-pivottable-field");
		let operation = controller.getAttribute("data-pivottable-operation");
		let pivotColumn = controller.getAttribute("data-pivottable-pivot");

		let data = {};
		let counts = {};
		let uniqueColumns = new Set();
		let rows = Array.from(sourceTable.querySelectorAll("tbody tr")).filter(row => row.offsetParent !== null);

		// Find field indexes dynamically
		let headers = Array.from(sourceTable.querySelectorAll("thead th"));
		let fieldIndex = headers.findIndex(th => th.textContent === dataField);
		let pivotIndex = headers.findIndex(th => th.textContent === pivotColumn);
		let groupIndexes = groupColumns.map(col => headers.findIndex(th => th.textContent === col));

		// Check if the field and pivot column indexes are valid
		if ( fieldIndex === -1 || pivotIndex === -1 ) {
			console.error(`Field "${dataField}" or pivot column "${pivotColumn}" not found.`);
			return;
		}

		// Read the original table data
		rows.forEach(row => {
			let cells = row.querySelectorAll("td");
			let groupKey = groupIndexes.map(index => cells[index].textContent).join("|");
			let pivotValue = cells[pivotIndex].textContent;
			let value = parseFloat(cells[fieldIndex].textContent);

			uniqueColumns.add(pivotValue);

			// Check if the group key already exists in the data object
			if ( !data[groupKey] ) {
				// Initialize the group key if it doesn't exist
				data[groupKey] = {};
				counts[groupKey] = {};
			}
			
			// Check if the pivot value already exists in the data object
			if ( !data[groupKey][pivotValue] ) {
				// Initialize the pivot value if it doesn't exist
				data[groupKey][pivotValue] = 0;
				counts[groupKey][pivotValue] = 0;
			}

			data[groupKey][pivotValue] += value;
			counts[groupKey][pivotValue]++;
		});

		// Apply aggregation operation
		if ( operation === "avg" ) {
			Object.keys(data).forEach(key => {
				Object.keys(data[key]).forEach(pivotValue => {
					if (counts[key][pivotValue] > 0) {
						data[key][pivotValue] = (data[key][pivotValue] / counts[key][pivotValue]).toFixed(2);
					}
				});
			});
		}

		// Sort data based on the specified column
		let sortedKeys = Object.keys(data).sort((a, b) => {
			let aValue = a.split("|")[groupColumns.indexOf(sortColumn)];
			let bValue = b.split("|")[groupColumns.indexOf(sortColumn)];
			return aValue.localeCompare(bValue);
		});

		// Create table dynamically
		let table = document.createElement("table");
		let thead = document.createElement("thead");
		let tbody = document.createElement("tbody");
		let theadRow = document.createElement("tr");

		// Copy any values from the "data-controller" attribute to the table element, except for the "pivottable" part
		let controllerAttributes = this.element.getAttribute("data-controller").split(" ").filter(attr => attr !== "pivottable").join(" ");
		table.setAttribute("data-controller", controllerAttributes);

		//Copy any attributes from the controller to the table element, except for the "data-controller" attribute and any attributes starting with "data-pivottable-"
		for ( let attr of this.element.attributes ) {
			if (
				attr.name !== "data-controller"
				&&
				attr.name.startsWith("data-")
				&&
				!attr.name.startsWith("data-pivottable-")
				&&
				!attr.name.startsWith("data-busywith")
			) {
				table.setAttribute(attr.name, attr.value);
			}
		}

		// Create dynamic headers
		let sortedColumns = Array.from(uniqueColumns).sort();
		theadRow.innerHTML = `<th>${groupColumns.join("</th><th>")}</th>` + sortedColumns.map(c => `<th>${c}</th>`).join("") + "<th>Total</th>";
		thead.appendChild(theadRow);

		// Populate the pivot table
		sortedKeys.forEach(key => {
			let groupValues = key.split("|");
			let row = document.createElement("tr");

			let rowData = groupValues.map(val => `<td>${val}</td>`);
			let total = 0;

			sortedColumns.forEach(pivotValue => {
				let value = data[key][pivotValue] || 0;
				total += parseFloat(value);
				rowData.push(`<td>${value}</td>`);
			});

			rowData.push(`<td><strong>${total}</strong></td>`);
			row.innerHTML = rowData.join("");
			tbody.appendChild(row);
		});

		// Append table to pivot container
		table.appendChild(thead);
		table.appendChild(tbody);
		controller.innerHTML = ""; // Clear previous table if any
		controller.appendChild(table);
	}

	getSourceTable() {
		let sourceTableId = this.element.getAttribute("data-pivottable-source");
		return document.getElementById(sourceTableId);
	}

    _addMutationListeners() {
		const oSourceTable = this.getSourceTable();
		// Create a MutationObserver to watch for changes in the form
		this.observer = new MutationObserver(() => {
			console.log("Mutation detected in source table. Rebuilding pivot table.");
			this.build();
		});
		
		// Re-create the pivot table when the source table changes
		this.observer.observe(oSourceTable, {
			childList: true,
			subtree: true
		});

		// Observe changes to hidden attribute in rows
		this.observer.observe(oSourceTable, {
			attributes: true,
			attributeFilter: ['hidden'],
			subtree: true
		});
		
	}

});