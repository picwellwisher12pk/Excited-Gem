import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
//@ts-ignore
import { sortTabs } from '~/scripts/general'
import { ArrowDownWideNarrow } from 'lucide-react'
import Btn from '../Btn'

const SortButton = ({ tabs }) => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    sortTabs(key, tabs)
  }
  const items: { key: string; label: string }[] = [
    {
      key: 'title',
      label: 'By Title'
    },
    {
      key: 'url',
      label: 'By URL'
    }
  ]

  return (
    <Dropdown menu={{ items, onClick }} className="mr-3" trigger={['click']}>
      <Btn className="flex items-center gap-1">
        <ArrowDownWideNarrow size={14} className="text-zinc-600" />
        <span className="hidden sm:inline">Sort Tabs</span>
        <DownOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
      </Btn>
    </Dropdown>
  )
}
export default SortButton
