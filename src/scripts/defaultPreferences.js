exports.preferences = {
  search:{
    regex : true,
    ignoreCase : true,
    searchIn: [true,true] // title,url
  },
  defaultTabsFrom : "current",
  tempTabsFrom: 'current',
  tabsGroup: {
    promptForClosure :true,
    tabsListAnimation: true,
    tabSortAnimation: true,
    //selection by ckeckbox/hover mode/click mode
    selectionBy: 'checkbox',
    display:{
      favicon: true,
      title: true,
      url:true,
      pin:true,
      sound: true,
      // close:true
    }
  }

};
