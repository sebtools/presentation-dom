function confirmUnmerge() {
	return confirm("Are you sure you want to unmerge this parish This action will remove this parish family and cannot be undone.");
}

document.addEventListener("DOMContentLoaded", function() {
	var forms = document.querySelectorAll("form.unmerge");
	forms.forEach(function(form) {
		form.onsubmit = function() {
			return confirmUnmerge();
		};
	});
});