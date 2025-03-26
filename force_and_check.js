//Make sure that the checkall doesn't step on the forcecheck's toes
document.addEventListener("checkall:toggled", (event) => {
	document.getElementById("phrases").forcecheck.enforceCheckStates();
});