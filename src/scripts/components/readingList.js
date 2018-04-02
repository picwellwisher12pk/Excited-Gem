 ////READING LISTS
  let itemGroup; //variable to stores data for React Component
  let ReadingLists; //React Component
  let readinglistsCounter;

let renderReadingLists = (items)=>{
    console.log("Getting Reading list",items);
    itemGroup = items.readinglists;
    if(items.readinglists == undefined){
         itemGroup = [];
         readinglistsCounter = 0;
    }else{
        itemGroup = items.readinglists;
        readinglistsCounter = items.readinglists.length;
    }
    return items.readinglists;
    ReadingLists.setState({data:itemGroup});
}
let getReadingLists = () => {
      chrome.storage.local.get("readinglists", renderReadingLists(items));
}
let setReadingLists = (data) => {
    chrome.storage.local.set({ readinglists: data }, function() {
      console.log('Saving readinglists');
      readinglistsCounter++;
      ReadingLists.setState({ data: itemGroup });
    });
  }
export {getReadingLists,setReadingLists};
