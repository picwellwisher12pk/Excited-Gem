import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ErrorBoundary from "../../../ErrorBoundary";
import SearchIcon from "search.svg";
import TimesIcon from "times.svg";
import VolumeIcon from "volume.svg";
import VolumeOffIcon from "volume-off.svg";
import ThumbtackIcon from "thumbtack.svg";
import ThumbtackActiveIcon from "thumbtack-active.svg";
import {toggleAudible, togglePinned, toggleSearchIn, updateSearchTerm} from "../../../searchSlice";

const Search = () => {
  console.log("search reloading");
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const pinnedSearch = useSelector((state) => state.search.pinnedSearch);
  const audibleSearch = useSelector((state) => state.search.audibleSearch);
  const {searchIn} = useSelector((state) => state.search);
  const regex = useSelector((state) => state.config.search.regex);
  const searchField = React.createRef();
  const title = React.createRef();
  const url = React.createRef();
  const [empty, setEmpty] = useState(true);
  const preparePlaceholder = (searchIn, initialPlaceholder = 'Search in ') => {
    let newPlaceholder = initialPlaceholder;
    newPlaceholder += searchIn[0] ? "Titles" : "";
    newPlaceholder += searchIn[0] && searchIn[1] ? " and " : "";
    newPlaceholder += searchIn[1] ? "URLs" : "";
    return newPlaceholder;
  }
  const [placeholder, setPlaceholder] = useState(() => preparePlaceholder(searchIn));

  useEffect(() => {
    setPlaceholder(preparePlaceholder(searchIn));
  }, [searchIn]);
  const onKeyUpped = (event) => {
    searchField.current.value !== "" ? setEmpty(false) : setEmpty(true);
    if (event.keyCode === 27) {
      clear();
    }
  };
  const handleChange = () => {
    dispatch(updateSearchTerm(searchField.current.value));
  };
  const clear = () => {
    searchField.current.value = "";
    setEmpty(true);
    dispatch(updateSearchTerm(""));
  };
  const toggleSearchInHandle = useCallback((title, url, number, event) => {
    let titleLocal = title.current.checked;
    let urlLocal = url.current.checked;
    if (!titleLocal && !urlLocal) {
      event.preventDefault();
      alert(
        "Sorry! You can't uncheck both Title and URL at the same time. One must remain checked."
      );
      return false;
    }
    dispatch(toggleSearchIn(number));
  }, []);

  let iconInSearch = !searchTerm ? (
    <SearchIcon
      className={`text-secondary`}
      style={{width: "40px", height: "43px", padding: "12px"}}
    />
  ) : (
    <TimesIcon
      className={`cp`}
      style={{width: "40px", height: "43px", padding: "12px", fill: "red"}}
      onClick={() => {
        if (!empty) clear();
      }}
    />
  );
  return (
    <ErrorBoundary>
      <section className="search-bar" style={{width: "66%", paddingRight: 0}}>
        <div id="filter-tabs" className="input-group filter-tabs">
          {iconInSearch}
          {regex && (
            <i
              className={`quicksearch-input form-control`}
              style={{maxWidth: "10px", border: "none", lineHeight: "28px"}}
            >
              /
            </i>
          )}
          <input
            id="quicksearch-input"
            type="text"
            ref={searchField}
            placeholder={placeholder}
            className="quicksearch-input form-control regex "
            onChange={handleChange}
            onKeyUp={(event) => {
              onKeyUpped(event);
            }}
            autoFocus
          />
          {regex && (
            <i
              className={`quicksearch-input form-control`}
              style={{maxWidth: "10px", border: "none", lineHeight: "28px"}}
            >
              /
            </i>
          )}
          <div className="input-group-append option-regex">
            <div style={{paddingTop: 6}}>
              <button
                className="btn btn-sm bg-transparent"
                title="Search audible only"
                onClick={() => dispatch(toggleAudible())}
              >
                {audibleSearch ? <VolumeIcon style={{height: 16, fill: "#0487cf"}}/> :
                  <VolumeOffIcon style={{height: 16, fill: "#0487cf"}}/>}
              </button>
            </div>
            <div className="mr-3" style={{paddingTop: 6}}>
              <button
                className="btn btn-sm bg-transparent"
                title="Search pinned only"
                onClick={() => dispatch(togglePinned())}
              >
                {pinnedSearch ? <ThumbtackActiveIcon style={{height: 16, fill: "#0487cf"}}/> :
                  <ThumbtackIcon style={{height: 16, fill: "#0487cf"}}/>}
              </button>
            </div>
            <div className="custom-control custom-checkbox ">
              <input
                type="checkbox"
                className="custom-control-input"
                id="prefTitle"
                ref={title}
                defaultChecked={searchIn[0] && "checked"}
                onClick={(e) => {
                  toggleSearchInHandle(title, url, 0, e);
                }}
              />
              <label
                className="custom-control-label input-group-text"
                htmlFor="prefTitle"
              >
                Title
              </label>
            </div>
          </div>
          <div className="input-group-append option-case-sensitive">
            <div className="custom-control custom-checkbox ">
              <input
                type="checkbox"
                className="custom-control-input"
                id="prefURL"
                ref={url}
                defaultChecked={searchIn[1] && "checked"}
                onClick={(e) => {
                  toggleSearchInHandle(title, url, 1, e);
                }}
              />
              <label
                className="custom-control-label input-group-text"
                htmlFor="prefURL"
              >
                URL
              </label>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

// const mapStateToProps = function (state) {
//   return {
//     regex: state.preferences.search.regex,
//     ignoreCase: state.preferences.search.ignoreCase,
//     searchIn: state.preferences.search.searchIn,
//     empty: state.preferences.search.empty,
//   };
// };
// const mapDispatchToProps = dispatch => ({
//   searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
//   toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray))
// });
export default Search;
