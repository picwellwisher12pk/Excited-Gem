import { Button, Checkbox, List, Modal, Typography, Space, Tooltip } from 'antd'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ExternalLink } from 'lucide-react'

const { Text, Title } = Typography

interface DuplicateTabsModalProps {
  visible: boolean
  onClose: () => void
}

export const DuplicateTabsModal: React.FC<DuplicateTabsModalProps> = ({
  visible,
  onClose
}) => {
  const { tabs } = useSelector((state: any) => state.tabs)
  const [selectedTabIds, setSelectedTabIds] = useState<number[]>([])

  // Group tabs by URL
  const duplicates = useMemo(() => {
    const urlGroups: Record<string, any[]> = {}
    tabs.forEach((tab: any) => {
      if (!urlGroups[tab.url]) {
        urlGroups[tab.url] = []
      }
      urlGroups[tab.url].push(tab)
    })

    // Filter only those with > 1 occurrence
    return Object.entries(urlGroups)
      .filter(([_, group]) => group.length > 1)
      .map(([url, group]) => ({ url, tabs: group }))
  }, [tabs])

  const handleCloseSelected = async () => {
    if (selectedTabIds.length === 0) return
    await chrome.tabs.remove(selectedTabIds)
    setSelectedTabIds([])
    // The tabs list will update automatically via Redux/listeners
  }

  const handleSelectAllDuplicates = () => {
    // Select all duplicates except the first one of each group (to keep one)
    const idsToSelect: number[] = []
    duplicates.forEach(({ tabs }) => {
      // Skip the first one, select the rest
      tabs.slice(1).forEach((tab) => idsToSelect.push(tab.id))
    })
    setSelectedTabIds(idsToSelect)
  }

  const handleSelectAll = () => {
    const idsToSelect: number[] = []
    duplicates.forEach(({ tabs }) => {
      tabs.forEach((tab) => idsToSelect.push(tab.id))
    })
    setSelectedTabIds(idsToSelect)
  }

  const toggleSelection = (id: number) => {
    setSelectedTabIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Duplicate Tabs
          </Title>{' '}
          <Text type="secondary">({duplicates.length} groups found)</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        <div className="flex justify-end gap-2">
          <Button key="close" onClick={onClose}>
            Done
          </Button>
          <Button key="keep-one" onClick={handleSelectAllDuplicates}>
            Select All Duplicates (Keep 1st)
          </Button>
          <Button key="select-all" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button
            key="remove"
            type="primary"
            danger
            disabled={selectedTabIds.length === 0}
            onClick={handleCloseSelected}
          >
            Close Selected ({selectedTabIds.length})
          </Button>
        </div>
      }
    >
      {duplicates.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No duplicate tabs found.
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <List
            itemLayout="vertical"
            dataSource={duplicates}
            renderItem={({ url, tabs: groupTabs }) => (
              <List.Item className="border-b border-gray-100 py-4">
                <div
                  className="mb-2 font-medium text-blue-600 truncate"
                  title={url}
                >
                  {url}
                </div>
                <div className="pl-4 space-y-2">
                  {groupTabs.map((tab: any) => (
                    <div
                      key={tab.id}
                      className="flex items-center justify-between bg-slate-50 p-2 rounded hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Checkbox
                          checked={selectedTabIds.includes(tab.id)}
                          onChange={() => toggleSelection(tab.id)}
                        />
                        {tab.favIconUrl && (
                          <img
                            src={tab.favIconUrl}
                            alt=""
                            className="w-4 h-4 flex-shrink-0"
                          />
                        )}
                        <span
                          className="truncate text-sm text-gray-700"
                          title={tab.title}
                        >
                          {tab.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                        <span>Win: {tab.windowId}</span>
                        <Tooltip title="Go to tab">
                          <Button
                            type="text"
                            size="small"
                            icon={<ExternalLink size={12} />}
                            onClick={() => {
                              chrome.windows.update(tab.windowId, {
                                focused: true
                              })
                              chrome.tabs.update(tab.id, { active: true })
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Modal>
  )
}
