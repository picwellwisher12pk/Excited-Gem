import { LoadingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import { useCallback, useState } from 'react'
import SortIcon from 'react:/src/icons/sort.svg'

import { processTabs, sortTabs } from '../../general'

const SortButton = ({ tabs }) => {
  const items: MenuProps['items'] = [
    {
      key: 'title',
      label: <a onClick={() => sortTabs('title', tabs)}>Title</a>
    },
    {
      key: 'url',
      label: <a onClick={() => sortTabs('url', tabs)}>URL</a>
    }
  ]

  console.log(items, 'items')
  const [sorting, setSorting] = useState(false)
  const handleSort = useCallback(
    async (sortType: string, tabs) => {
      setSorting(true)
      await sortTabs(sortType, tabs)
      setSorting(false)
    },
    [tabs]
  )
  let sortingIcon = sorting ? (
    <LoadingOutlined />
  ) : (
    <SortIcon className="!fill-slate-700" style={{ height: 12, width: 14 }} />
  )

  return (
    <Dropdown menu={{ items }} className="mr-3" trigger={['click']}>
      <Button
        size={'small'}
        onClick={(e) => e.preventDefault()}
        className="!border-0 !bg-gradient-to-b !from-white !to-slate-200">
        <Space>
          {sortingIcon}
          <span>Sort</span>
        </Space>
      </Button>
    </Dropdown>
  )
}
export default SortButton
