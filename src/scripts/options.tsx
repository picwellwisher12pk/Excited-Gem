// Saves options to chrome.storage.sync.
function save_options(e) {
     e.preventDefault();
      let pref = {};
    pref.filterType = $('#filter-type-option-id').val();
    pref.filterCase = $('#filterCase-option-id').prop('checked');
    console.log(pref)
    chrome.storage.sync.set({
        pref: pref
    }, function () {
        // Update status to let user know options were saved.
        console.log(pref);
        let status = document.getElementById('status');
        $('#status>span').text('Options Saved');
        $('#status').fadeIn('slow')
        // status.textContent = 'Options saved.';
        setTimeout(function () {
            $('#status').fadeOut('slow')
            $('#status>span').text('');
        }, 2500);
    });
  
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get("pref", function (items) {
        console.log(items);
       $('#filter-type-option-id').val(items.pref.filterType)
       $('#filterCase-option-id').prop('checked': items.pref.filterCase)
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click', save_options);
$('#save').on('click',save_options);
