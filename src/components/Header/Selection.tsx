import {Checkbox} from 'antd'
import {memo, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {clearSelectedTabs, invertSelectedTabs, selectAllTabs} from '~/store/tabSlice'
import Btn from '~/components/Btn'


const Selection = () => {
  const dispatch = useDispatch()
  const {selectedTabs, tabs, filteredTabs} = useSelector(
    (state) => state['tabs']
  )
  //Event Handlers
  const handleInversion = useCallback(() => dispatch(invertSelectedTabs()), [])
  const handleAllSelection = useCallback(() => {
    if (selectedTabs.length < filteredTabs.length) dispatch(selectAllTabs())
    if (selectedTabs.length === filteredTabs.length) {
      dispatch(clearSelectedTabs())
    }
  }, [selectedTabs, filteredTabs])

  return (
    <div className="flex shadow-md">
      <span
        className="bg-zinc-200 px-2 !rounded-l-sm text-black select-none"
        title="Un/Select only filtered or visible tabs">
        <Checkbox
          onChange={handleAllSelection}
          indeterminate={
            selectedTabs.length > 0 && selectedTabs.length < filteredTabs.length
          }
          checked={selectedTabs.length === filteredTabs.length}
        />
      </span>
      <Btn
        title="Invert Selection"
        onClick={handleInversion}
        className="!rounded-l-[0] shdow-none">
        Invert
      </Btn>
    </div>
  )
}
export default memo(Selection)
