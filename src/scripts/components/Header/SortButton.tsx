import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { useCallback } from 'react'
//@ts-ignore
import SortIcon from 'react:/src/icons/sort.svg'

import { sortTabs } from '../../general'
import Btn from '../Btn'





const SortButton = ({ tabs }) => {
  const handleSortByTitle = useCallback(() => sortTabs('title', tabs), [tabs])
  const handleSortByURL = useCallback(() => sortTabs('url', tabs), [tabs])
  const items: MenuProps['items'] = [
    {
      key: 'title',
      label: <a onClick={handleSortByTitle}>Title</a>
    },
    {
      key: 'url',
      label: <a onClick={handleSortByURL}>URL</a>
    }
  ]

  return (
    <Dropdown menu={{ items }} className="mr-3" trigger={['click']}>
      <Btn>
        <SortIcon className="!fill-slate-700" style={{ height: 12 }} />
        <span>Sort</span>
        <DownOutlined className="text-zinc-500" />
      </Btn>
    </Dropdown>
  )
}
export default SortButton
