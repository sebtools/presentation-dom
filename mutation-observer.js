const oObserved = document.getElementById('observed');
const form = document.getElementById('control');
const oText = document.getElementById('textInput');

// MutationObserver setup
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        let oItem = document.createElement('li');
        if ( mutation.type === 'attributes' ) {
            oItem.textContent = `Attribute '${mutation.attributeName}' changed to '${oObserved.style.backgroundColor}'`;
        } else if ( mutation.type === 'childList' ) {
            oItem.textContent = `Text changed to '${oObserved.textContent}'`;
        }
        document.getElementById('logList').appendChild(oItem);
    });
});

observer.observe(oObserved, { attributes: true, childList: true, subtree: true });

// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if ( oText.value ) {
        oObserved.textContent = oText.value;
    }
    oObserved.style.backgroundColor = document.getElementById('colorInput').value;
});