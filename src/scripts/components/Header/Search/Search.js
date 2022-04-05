import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../../ErrorBoundary";
import SearchIcon from "search.svg";
import TimesIcon from "times.svg";
import VolumeIcon from "volume.svg";
import VolumeOffIcon from "volume-off.svg";
import ThumbtackIcon from "thumbtack.svg";
import ThumbtackActiveIcon from "thumbtack-active.svg";
import Loading from "spinner-third.svg";
import { debounce } from "lodash";
import {
  toggleAudible,
  togglePinned,
  toggleSearchIn,
  updateSearchTerm,
} from "../../../searchSlice";

const doPlaceholder = (searchIn, regex = false) => {
  let newPlaceholder = "Search in ";
  newPlaceholder += searchIn[0] ? "Titles" : "";
  newPlaceholder += searchIn[0] && searchIn[1] ? " and " : "";
  newPlaceholder += searchIn[1] ? "URLs" : "";
  return regex ? `/ ${newPlaceholder} /gi` : newPlaceholder;
};
const Search = () => {
  const dispatch = useDispatch();

  //Global States
  const { searchTerm, pinnedSearch, audibleSearch, searchIn } = useSelector(
    (state) => state.search
  );
  const regex = useSelector((state) => state.config.search.regex);

  //Refs
  const searchField = React.createRef();
  const title = React.createRef();
  const url = React.createRef();

  //Local States
  const [empty, setEmpty] = useState(true);
  const [iconState, setIconState] = useState("default");
  const [placeholder, setPlaceholder] = useState(() =>
    doPlaceholder(searchIn, regex)
  );

  useEffect(() => {
    setPlaceholder(doPlaceholder(searchIn, regex));
  }, [searchIn]);
  const handleKeyUp = useCallback((event) => {
    const { value } = event.target;
    if (value === "" || event.key === "Escape") {
      clear(event.target);
      return;
    } else {
      value && setIconState("searching");
      return;
    }
  }, []);
  const handleChange = useCallback(
    debounce((event) => {
      const { value } = event.target;
      dispatch(updateSearchTerm(value));
    }, 300),

    []
  );

  const clear = (target) => {
    console.log("clearing");
    target.value = "";
    setIconState("default");
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
  let iconInSearch;
  switch (iconState) {
    case "loading":
      iconInSearch = (
        <Loading
          className={"spinner"}
          style={{ width: "40px", height: "43px", padding: "12px" }}
        />
      );
      break;
    case "searching":
      iconInSearch = (
        <TimesIcon
          className={`cp`}
          style={{
            width: "40px",
            height: "43px",
            padding: "12px",
            fill: "red",
          }}
          onClick={() => {
            if (!empty) clear();
          }}
        />
      );
      break;
    default:
      iconInSearch = (
        <SearchIcon
          className={`text-secondary`}
          style={{ width: "40px", height: "43px", padding: "12px" }}
        />
      );
      break;
  }

  return (
    <ErrorBoundary>
      <section className="search-bar" style={{ width: "66%", paddingRight: 0 }}>
        <div id="filter-tabs" className="input-group filter-tabs">
          {iconInSearch}
          {regex && (
            <i
              className={`quicksearch-input form-control`}
              style={{ maxWidth: "10px", border: "none", lineHeight: "28px" }}
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
            onKeyUp={handleKeyUp}
            autoFocus
          />
          {regex && (
            <i
              className={`quicksearch-input form-control`}
              style={{ maxWidth: "10px", border: "none", lineHeight: "28px" }}
            >
              /
            </i>
          )}
          <div className="input-group-append option-regex">
            <div style={{ paddingTop: 6 }}>
              <button
                className="btn btn-sm bg-transparent"
                title="Search audible only"
                onClick={() => dispatch(toggleAudible())}
              >
                {audibleSearch ? (
                  <VolumeIcon style={{ height: 16, fill: "#0487cf" }} />
                ) : (
                  <VolumeOffIcon style={{ height: 16, fill: "#0487cf" }} />
                )}
              </button>
            </div>
            <div className="mr-3" style={{ paddingTop: 6 }}>
              <button
                className="btn btn-sm bg-transparent"
                title="Search pinned only"
                onClick={() => dispatch(togglePinned())}
              >
                {pinnedSearch ? (
                  <ThumbtackActiveIcon
                    style={{ height: 16, fill: "#0487cf" }}
                  />
                ) : (
                  <ThumbtackIcon style={{ height: 16, fill: "#0487cf" }} />
                )}
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
