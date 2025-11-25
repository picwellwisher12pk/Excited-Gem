import { Checkbox, Input, Popover, message } from 'antd'
import { debounce } from 'lodash'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ThumbtackActiveIcon from 'react:~/icons/thumbtack-active.svg'
import ThumbtackIcon from 'react:~/icons/thumbtack.svg'
import VolumeOffIcon from 'react:~/icons/volume-off.svg'
import VolumeIcon from 'react:~/icons/volume.svg'

import ErrorBoundary from '~/scripts/ErrorBoundary'
import { makePlaceholder as doPlaceholder } from '~/scripts/general'
import { toggleAudible, togglePinned, toggleRegex, toggleSearchIn, updateSearchTerm } from '~/store/searchSlice'

const { Search: AntSearch } = Input

const Search = () => {
  const dispatch = useDispatch()
  const { filteredTabs } = useSelector((state) => state.tabs)

  //Global States
  const { searchTerm, pinnedSearch, audibleSearch, searchIn, regex } =
    useSelector((state) => state.search)
  //Refs
  const searchField = React.useRef()
  //Local States
  const [placeholder, setPlaceholder] = useState(() =>
    doPlaceholder(searchIn, regex)
  )

  useEffect(() => {
    setPlaceholder(doPlaceholder(searchIn, regex))
  }, [searchIn])
  useEffect(() => {
  }, [regex])
  useEffect(() => {
    if (searchTerm === '') {
      const inputSearch = document.getElementById('search-field')
      inputSearch.value = ''
    }
  }, [searchTerm])

  const handleKeyUp = useCallback((event) => {
    const { value } = event.target
    if (value === '' || event.key === 'Escape') {
      // @ts-ignore
      searchField.current.input.value = ''
      dispatch(updateSearchTerm(''))
      return
    }
  }, [])
  const handleChange = useCallback(
    debounce((value) => {
      dispatch(updateSearchTerm(value))
    }, 300),
    []
  )

  const toggleSearchInHandle = (param, event) => {
    const newSearchIn = { ...searchIn, [param]: !searchIn[param] }
    if (Object.values(newSearchIn).every((v) => v === false)) {
      event.preventDefault()
      message.warning(
        "At least one search field must remain active. Please keep either Title or URL checked."
      )
      event.target.checked = true
      return false
    }
    dispatch(toggleSearchIn(newSearchIn))
  }
  const content = (
    <div>
      <p>
        <label>
          <Checkbox
            checked={searchIn.title}
            onChange={(e) => toggleSearchInHandle('title', e)}
          />{' '}
          Title
        </label>
      </p>
      <p className="mb-0 pb-0">
        <label>
          <Checkbox
            checked={searchIn.url}
            onChange={(e) => toggleSearchInHandle('url', e)}
          />{' '}
          URL
        </label>
      </p>
    </div>
  )

  return (
    <ErrorBoundary>
      <AntSearch
        className="!w-3/4"
        id="search-field"
        ref={searchField}
        onKeyUp={handleKeyUp}
        prefix={
          regex ? (
            <span className="text-zinc-300">/</span>
          ) : (
            <span className="text-white">/</span>
          )
        }
        suffix={
          <>
            {searchTerm && (
              <span className="text-zinc-400">
                {filteredTabs.length + ' Tabs found... '}
              </span>
            )}
            {regex && <span className="text-zinc-300 pr-3">/gi</span>}
            <div className="flex align-items-center ml-3">
              <div className="mr-3">
                <button
                  className="!border-0 flex align-items-center"
                  type="button"
                  aria-label={audibleSearch ? "Show all tabs (currently filtering audible only)" : "Filter audible tabs only"}
                  title={audibleSearch ? "Show all tabs" : "Filter audible tabs only"}
                  onClick={() => dispatch(toggleAudible())}>
                  {audibleSearch ? (
                    <VolumeIcon className="fill-[#0487cf] h-[16px]" aria-hidden="true" />
                  ) : (
                    <VolumeOffIcon className="fill-[#0487cf] h-[16px]" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {audibleSearch ? "Currently showing audible tabs only" : "Showing all tabs"}
                  </span>
                </button>
              </div>
              <div className="mr-3">
                <button
                  className="!border-0 bg-transparent cursor-pointer"
                  type="button"
                  aria-label={pinnedSearch ? "Show all tabs (currently filtering pinned only)" : "Filter pinned tabs only"}
                  title={pinnedSearch ? "Show all tabs" : "Filter pinned tabs only"}
                  onClick={() => dispatch(togglePinned())}>
                  {pinnedSearch ? (
                    <ThumbtackActiveIcon className="fill-[#0487cf] h-[16px]" aria-hidden="true" />
                  ) : (
                    <ThumbtackIcon className="fill-[#0487cf] h-[16px]" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {pinnedSearch ? "Currently showing pinned tabs only" : "Showing all tabs"}
                  </span>
                </button>
              </div>
            </div>
            <label htmlFor="regex-checkbox">
              <Checkbox
                id="regex-checkbox"
                defaultChecked={regex}
                onChange={() => dispatch(toggleRegex())}
                aria-label="Enable regular expression search mode"
              />{' '}
              Regex
            </label>
            <Popover content={content} trigger="click">
              <button
                type="button"
                className="ml-3 bg-transparent border-0 text-blue-600 cursor-pointer hover:underline"
                aria-label="Choose search fields (title and/or URL)">
                Search by...
              </button>
            </Popover>
          </>
        }
        placeholder={placeholder}
        autoFocus
        // onChange={(e) => handleChange(e.target.value)}
        onSearch={(value, e) => handleChange(value)}
      />
    </ErrorBoundary>
  )
}

export default memo(Search)
