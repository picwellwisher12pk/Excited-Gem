const data = require("./dummyTabs.json");
let searchParameters = {
  searchTerm: "yt",
  audibleSearch: false,
  pinnedSearch: false,
  searchIn: [true, true],
};
const filterTabs = (
  { searchTerm, audibleSearch, pinnedSearch, searchIn },
  { ignoreCase, regex },
  tabs
) => {
  console.time("filterTabs");
  let filteredTabs = tabs?.filter(({ title, url, audible, pinned }) => {
    const isAudible = audibleSearch ? audible === true : true;
    const isPinned = pinnedSearch ? pinned === true : true;
    if (regex) {
      /* If the search term is found in the title or the URL, and the site is
      audible and pinned, return true. */
      try {
        let regexTest = new RegExp(searchTerm, ignoreCase ? "i" : "");
        if (searchIn[0] && regexTest.test(title) && isAudible && isPinned)
          return true;
        if (searchIn[1] && regexTest.test(url) && isAudible && isPinned)
          return true;
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      if (searchIn[0] && !ignoreCase)
        return title.includes(searchTerm) && isAudible && isPinned;
      if (searchIn[0] && ignoreCase)
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          isAudible &&
          isPinned
        );
      if (searchIn[1])
        return (
          url.toLowerCase().includes(searchTerm.toLowerCase()) &&
          isAudible &&
          isPinned
        );
    }
  });
  console.timeEnd("filterTabs");
  return filteredTabs;
};
const reduceTabs = (
  { searchTerm, audibleSearch, pinnedSearch, searchIn },
  { ignoreCase, regex },
  tabs
) => {
  console.time("reduceTabs");
  let reducedTabs = tabs.reduce((accumulator, tab) => {
    const { title, url, audible, pinned } = tab;
    const isAudible = audibleSearch ? audible === true : true;
    const isPinned = pinnedSearch ? pinned === true : true;
    if (regex) {
      try {
        let regexTest = new RegExp(searchTerm, ignoreCase ? "i" : "");
        if (searchIn[0] && regexTest.test(title) && isAudible && isPinned)
          accumulator.push(tab);
        if (searchIn[1] && regexTest.test(url) && isAudible && isPinned)
          accumulator.push(tab);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      if (searchIn[0] && !ignoreCase)
        if (title.includes(searchTerm) && isAudible && isPinned)
          accumulator.push(tab);
      if (searchIn[0] && ignoreCase)
        if (
          title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          isAudible &&
          isPinned
        )
          accumulator.push(tab);
      if (searchIn[1])
        if (
          url.toLowerCase().includes(searchTerm.toLowerCase()) &&
          isAudible &&
          isPinned
        )
          accumulator.push(tab);
    }
    return accumulator;
  }, []);
  reducedTabs = [...new Set(reducedTabs)];
  console.timeEnd("reduceTabs");
  return reducedTabs;
};

//Filter Test
console.time("filterTabOuter");
const filteredTabs = filterTabs(
  searchParameters,
  { ignoreCase: 1, regex: 0 },
  data.tabs
);
console.timeEnd("filterTabOuter");
console.log(data.tabs.length, filteredTabs.length, "\n\r");

//Reduce Test
console.time("reduceTabOuter");
const reducedTabs = reduceTabs(
  searchParameters,
  { ignoreCase: 1, regex: 0 },
  data.tabs
);
console.timeEnd("reduceTabOuter");
console.log(data.tabs.length, reducedTabs.length, "\r\n");

/*
Result:: Filter took approx ~0.5ms to filter 146 tabs for 'yt' resulting in 48 tabs

filterTabs: 0.555ms
filterTabOuter: 7.646ms
146 48

reduceTabs: 0.517ms
reduceTabOuter: 0.923ms
146 48

 */
