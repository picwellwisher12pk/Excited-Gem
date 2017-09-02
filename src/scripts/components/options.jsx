////GENERAL OPTIONS/CONFIGURATIONS
  let pref = {
    filterType: '',
    filterCase: false,
    sortAnimation: 250
  };

function getOptions() {
    chrome.storage.local.get("pref", function(items) {
      pref.filterType = items.pref.filterType;
      pref.filterCase = items.pref.filterCase;
      pref.sortAnimation = items.pref.sortAnimation;
      $(".option-case-sensitive input").prop("checked": pref.filterCase);

      if (pref.filterType == "regex") {
        $(".option-regex input").prop("checked": true);
      } else {
        $(".option-regex input").prop("checked": false);
      }
    });
}
