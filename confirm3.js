document.addEventListener("DOMContentLoaded", function() {
    var forms = document.querySelectorAll("form[data-confirm]");
    forms.forEach(function(form) {
        form.onsubmit = function() {
            return confirm(form.getAttribute("data-confirm"));
        };
    });
});