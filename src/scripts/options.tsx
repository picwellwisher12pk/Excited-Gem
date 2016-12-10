// Saves options to chrome.storage.sync.
function save_options() {
    let pref = {};
    pref.filterType = document.getElementById('filter-type-option-id').value;
    pref.filterCase = document.getElementById('filterCase').value;
    chrome.storage.sync.set({
        pref: pref
    }, function () {
        // Update status to let user know options were saved.
        let status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get("pref", function (items) {
        console.log(items);
        document.getElementById('filter-type-option-id').value = items.pref.filterType;
        document.getElementById('filterCase-option-id').checked = items.pref.filterCase;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
