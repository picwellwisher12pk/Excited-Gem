import { Checkbox, Input, Popover, message } from 'antd'
import { debounce } from 'lodash'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pin, PinOff, Volume2, VolumeX } from 'lucide-react'
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
  const [searchBehavior, setSearchBehavior] = useState('debounce')

  useEffect(() => {
    chrome.storage.local.get(['searchBehavior'], (result) => {
      if (result.searchBehavior) {
        setSearchBehavior(result.searchBehavior)
      }
    })
  }, [])

  useEffect(() => {
    setPlaceholder(doPlaceholder(searchIn, regex))
  }, [searchIn])
  useEffect(() => {
  }, [regex])
  useEffect(() => {
    if (searchTerm === '') {
      const inputSearch = document.getElementById('search-field')
      // @ts-ignore
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

  const debouncedUpdate = useCallback(
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
      <div className="flex-1 ml-4 min-w-0 flex items-center gap-2 overflow-hidden">
        <AntSearch
          className="!w-3/4 !ml-auto !ms-auto"
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
            <div className="flex items-center">
              {searchTerm && (
                <span className="text-zinc-400 max-w-[100px] truncate inline-block align-middle mr-2">
                  {filteredTabs.length + ' found'}
                </span>
              )}
              {regex && <span className="text-zinc-300 mr-2">/gi</span>}

              <div className="flex items-center gap-2 border-l border-zinc-200 pl-2 ml-1">
                <button
                  className="!border-0 flex align-items-center bg-transparent cursor-pointer p-0"
                  type="button"
                  aria-label={audibleSearch ? "Show all tabs" : "Filter audible only"}
                  title={audibleSearch ? "Show all tabs" : "Filter audible only"}
                  onClick={() => dispatch(toggleAudible())}>
                  {audibleSearch ? (
                    <Volume2 size={16} className="text-[#0487cf]" aria-hidden="true" />
                  ) : (
                    <VolumeX size={16} className="text-[#0487cf]" aria-hidden="true" />
                  )}
                </button>

                <button
                  className="!border-0 bg-transparent cursor-pointer flex align-items-center p-0"
                  type="button"
                  aria-label={pinnedSearch ? "Show all tabs" : "Filter pinned only"}
                  title={pinnedSearch ? "Show all tabs" : "Filter pinned only"}
                  onClick={() => dispatch(togglePinned())}>
                  {pinnedSearch ? (
                    <Pin size={16} className="text-[#0487cf] fill-current" aria-hidden="true" />
                  ) : (
                    <Pin size={16} className="text-[#0487cf]" aria-hidden="true" />
                  )}
                </button>

                <label htmlFor="regex-checkbox" className="flex items-center cursor-pointer select-none">
                  <Checkbox
                    id="regex-checkbox"
                    defaultChecked={regex}
                    onChange={() => dispatch(toggleRegex())}
                    aria-label="Enable regex"
                    className="mr-1"
                  />
                  <span className="text-xs text-zinc-500">Regex</span>
                </label>

                <Popover content={content} trigger="click">
                  <button
                    type="button"
                    className="bg-transparent border-0 text-blue-600 cursor-pointer hover:underline text-xs whitespace-nowrap p-0"
                    aria-label="Search options">
                    Search in
                  </button>
                </Popover>
              </div>
            </div>
          }
          placeholder={placeholder}
          autoFocus
          onChange={(e) => {
            if (searchBehavior === 'debounce') {
              debouncedUpdate(e.target.value)
            }
          }}
          onSearch={(value) => dispatch(updateSearchTerm(value))}
        />
      </div>
    </ErrorBoundary>
  )
}

export default memo(Search)
