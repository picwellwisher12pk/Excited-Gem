import { Dropdown, MenuProps, Badge } from 'antd'
import { MoreVertical, Copy, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Btn from '~/components/Btn'
import { DuplicateTabsModal } from '~/components/Modals/DuplicateTabsModal'

const MoreActionsMenu = () => {
  const { tabs } = useSelector((state: any) => state.tabs)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)

  const duplicateCount = useMemo(() => {
    const urlCounts: Record<string, number> = {}
    tabs.forEach((tab: any) => {
      urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1
    })
    return Object.values(urlCounts).reduce(
      (acc, count) => acc + (count > 1 ? count : 0),
      0
    )
  }, [tabs])

  const items: MenuProps['items'] = [
    {
      key: 'highlight-duplicates',
      label: `Manage Duplicates (${duplicateCount})`,
      icon: <Copy size={14} />,
      onClick: () => setIsDuplicateModalOpen(true),
      disabled: duplicateCount === 0
    },

    {
      key: 'force-refresh',
      label: 'Force refresh tabs view',
      icon: <RefreshCw size={14} />,
      onClick: () => window.location.reload()
    }
  ]

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Btn className="flex items-center justify-center px-2">
          <Badge count={duplicateCount} size="small" offset={[0, -5]}>
            <MoreVertical size={16} />
          </Badge>
        </Btn>
      </Dropdown>

      <DuplicateTabsModal
        visible={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
      />
    </>
  )
}

export default MoreActionsMenu
