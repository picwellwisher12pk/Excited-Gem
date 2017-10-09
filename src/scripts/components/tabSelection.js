export let selectedTabIndex;
export default function selectTab(number) {
    if (number < 0) number = 0;
    $('.eg .tabs-list.list-group li.list-group-item').removeClass('selected');
    $('.eg .tabs-list.list-group').find('li.list-group-item:nth(' + number + ')').addClass('selected');
    selectedTabIndex = number;
}
$(document).keydown(function(e) {
    console.log(e.key, e.which, e.code);
    if (e.which == 40) {
        console.log(selectedTabIndex, $('.eg .tabs-list li').length);
        if (selectedTabIndex >= $('.eg .tabs-list li').length) {
            selectTab($('.eg .tabs-list li').length - 1);
        } else if (selectedTabIndex < $('.eg .tabs-list li').length - 1) {
            selectTab(selectedTabIndex + 1);
        }
    }
    if (e.which == 36) { //Home
        selectTab(0);
    }
    if (e.which == 35) { //End
        selectTab($('.eg .tabs-list li').length - 1);
    }
    if (e.which == 38) {
        selectTab(selectedTabIndex - 1);
    }
    if (e.which == 13) { //focus tab on Enter
        let id = $('.eg .tabs-list li.list-group-item:nth(' + selectedTabIndex + ')').attr('data-id');
        packageAndBroadcast(sender, "background", "focusTab", id);
    }
    if (e.which == 46) {
        let id = $('.eg .tabs-list li.list-group-item:nth(' + selectedTabIndex + ')').attr('data-id');
        if (confirm('Are you sure you want to close the following this Tab')) { packageAndBroadcast(sender, "background", "closeTab", id); }
    }
});