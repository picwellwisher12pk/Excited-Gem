import {Checkbox, Input, Popover} from 'antd'
import {debounce} from 'lodash'
import React, {memo, useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import ThumbtackActiveIcon from 'react:/src/icons/thumbtack-active.svg'
import ThumbtackIcon from 'react:/src/icons/thumbtack.svg'
import VolumeOffIcon from 'react:/src/icons/volume-off.svg'
import VolumeIcon from 'react:/src/icons/volume.svg'

import ErrorBoundary from '/src/scripts/ErrorBoundary'
import {makePlaceholder as doPlaceholder} from '/src/scripts/general'
import {toggleAudible, togglePinned, toggleRegex, toggleSearchIn, updateSearchTerm} from '/src/store/searchSlice'

const {Search: AntSearch} = Input

const Search = () => {
  const dispatch = useDispatch()
  const {filteredTabs} = useSelector((state) => state.tabs)

  //Global States
  const {searchTerm, pinnedSearch, audibleSearch, searchIn, regex} =
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
    const {value} = event.target
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
    const newSearchIn = {...searchIn, [param]: !searchIn[param]}
    if (Object.values(newSearchIn).every((v) => v === false)) {
      event.preventDefault()
      alert(
        "Sorry! You can't uncheck both Title and URL at the same time. One must remain checked."
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
                  title="Search audible only"
                  onClick={() => dispatch(toggleAudible())}>
                  {audibleSearch ? (
                    <VolumeIcon className="fill-[#0487cf] h-[16px]"/>
                  ) : (
                    <VolumeOffIcon className="fill-[#0487cf] h-[16px]"/>
                  )}
                </button>
              </div>
              <div className="mr-3">
                <a
                  className="!border-0"
                  title="Search pinned only"
                  onClick={() => dispatch(togglePinned())}>
                  {pinnedSearch ? (
                    <ThumbtackActiveIcon className="fill-[#0487cf] h-[16px]"/>
                  ) : (
                    <ThumbtackIcon className="fill-[#0487cf] h-[16px]"/>
                  )}
                </a>
              </div>
            </div>
            <label>
              <Checkbox
                defaultChecked={regex}
                onChange={() => dispatch(toggleRegex())}
              />{' '}
              Regex
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
        // onChange={(e) => handleChange(e.target.value)}
        onSearch={(value, e) => handleChange(value)}
      />
    </ErrorBoundary>
  )
}

export default memo(Search)
