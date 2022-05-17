import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "~/scripts/ErrorBoundary";
import SearchIcon from "~/icons/search.svg?component";
import TimesIcon from "~/icons/times.svg?component";
import VolumeIcon from "~/icons/volume.svg?component";
import VolumeOffIcon from "~/icons/volume-off.svg?component";
import ThumbtackIcon from "~/icons/thumbtack.svg?component";
import ThumbtackActiveIcon from "~/icons/thumbtack-active.svg?component";
import Loading from "~/icons/spinner-third.svg?component";
import { debounce } from "lodash";
import {
  toggleAudible,
  togglePinned,
  toggleSearchIn,
  updateSearchTerm,
} from "../../../searchSlice";
import { Input, Checkbox, Popover, Button } from "antd";
const { Search: AntSearch } = Input;
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
  const searchField = React.useRef();
  const title = React.useRef();
  const url = React.useRef();
  //Local States
  const [placeholder, setPlaceholder] = useState(() =>
    doPlaceholder(searchIn, regex)
  );
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    setPlaceholder(doPlaceholder(searchIn, regex));
  }, [searchIn]);
  useEffect(() => {
    if (searchTerm === "") {
      const inputSearch = document.getElementById("search-field");
      // @ts-ignore
      inputSearch.value = "";
    }
  }, [searchTerm]);

  const handleKeyUp = useCallback((event) => {
    console.log("keyup", event);
    const { value } = event.target;
    if (value === "" || event.key === "Escape") {
      console.log(searchField);
      // @ts-ignore
      searchField.current.input.value = "";
      dispatch(updateSearchTerm(""));
      return;
    }
  }, []);
  const handleChange = useCallback(
    debounce((value) => {
      dispatch(updateSearchTerm(value));
    }, 300),
    []
  );

  // const clear = (searchField) => {

  // };
  const toggleSearchInHandle = useCallback((param, event) => {
    console.log(title, url, param, event);
    // let titleLocal = title.current.state.checked;
    // let urlLocal = url.current.state.checked;
    // if (!titleLocal && !urlLocal) {
    //   event.preventDefault();
    //   alert(
    //     "Sorry! You can't uncheck both Title and URL at the same time. One must remain checked."
    //   );
    //   return false;
    // }
    // dispatch(toggleSearchIn(param));
  }, []);
  const content = (
    <div>
      <p>
        <label>
          <Checkbox
            ref={title}
            defaultChecked={searchIn.title}
            onChange={(e) => toggleSearchInHandle("title", e)}
          />{" "}
          Title
        </label>
      </p>
      <p className="mb-0 pb-0">
        <label>
          <Checkbox
            ref={url}
            defaultChecked={searchIn.url}
            onChange={(e) => toggleSearchInHandle("url", e)}
          />{" "}
          URL
        </label>
      </p>
    </div>
  );

  return (
    <ErrorBoundary>
      <AntSearch
        className="!w-3/4"
        // defaultValue={searchTerm}
        id="search-field"
        ref={searchField}
        onKeyUp={handleKeyUp}
        // bordered={false}
        prefix={regex && "/"}
        suffix={
          <>
            <div className="flex option-regex">
              <div className="mr-3">
                <a
                  className="!border-0"
                  title="Search audible only"
                  onClick={() => dispatch(toggleAudible())}
                >
                  {audibleSearch ? (
                    <VolumeIcon style={{ height: 16, fill: "#0487cf" }} />
                  ) : (
                    <VolumeOffIcon style={{ height: 16, fill: "#0487cf" }} />
                  )}
                </a>
              </div>
              <div className="mr-3">
                <a
                  className="!border-0"
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
                </a>
              </div>
            </div>
            <label>
              <Checkbox defaultChecked={regex} /> Regex
            </label>
            <Popover content={content} trigger="click">
              <a type="link" className="ml-3">
                Search by...
              </a>
            </Popover>
          </>
        }
        placeholder={placeholder}
        autoFocus
        allowClear
        // onChange={(e) => handleChange(e.target.value)}
        onSearch={(value, e) => handleChange(value)}
      />
    </ErrorBoundary>
  );
};

export default Search;
