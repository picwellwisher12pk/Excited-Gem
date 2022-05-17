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
import { makePlaceholder as doPlaceholder } from "../../general";
import { Input, Checkbox, Popover, Button } from "antd";
const { Search: AntSearch } = Input;

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
    console.log("setting placeholder: searchIn changed");
  }, [searchIn]);
  useEffect(() => {
    if (searchTerm === "") {
      const inputSearch = document.getElementById("search-field");
      // @ts-ignore
      inputSearch.value = "";
    }
  }, [searchTerm]);

  const handleKeyUp = useCallback((event) => {
    const { value } = event.target;
    if (value === "" || event.key === "Escape") {
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

  const toggleSearchInHandle = (param, event) => {
    const newSearchIn = { ...searchIn, [param]: !searchIn[param] };

    console.log(newSearchIn, [param], event);

    if (Object.values(newSearchIn).every((v) => v === false)) {
      event.preventDefault();
      alert(
        "Sorry! You can't uncheck both Title and URL at the same time. One must remain checked."
      );
      event.target.checked = true;
      return false;
    }
    dispatch(toggleSearchIn(newSearchIn));
  };
  const content = (
    <div>
      <p>
        <label>
          <Checkbox
            ref={title}
            checked={searchIn.title}
            onChange={(e) => toggleSearchInHandle("title", e)}
          />{" "}
          Title
        </label>
      </p>
      <p className="mb-0 pb-0">
        <label>
          <Checkbox
            ref={url}
            checked={searchIn.url}
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
                    <VolumeIcon className="fill-[#0487cf] h-[16px]" />
                  ) : (
                    <VolumeOffIcon className="fill-[#0487cf] h-[16px]" />
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
                    <ThumbtackActiveIcon className="fill-[#0487cf] h-[16px]" />
                  ) : (
                    <ThumbtackIcon className="fill-[#0487cf] h-[16px]" />
                  )}
                </a>
              </div>
            </div>
            <label>
              <Checkbox defaultChecked={regex} /> Regex
            </label>
            <Popover content={content}>
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
