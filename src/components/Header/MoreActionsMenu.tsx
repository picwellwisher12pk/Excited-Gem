import { Dropdown, MenuProps, Badge } from 'antd'
import { MoreVertical, Copy } from 'lucide-react'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Btn from '~/components/Btn'
import { updateSearchTerm, toggleSearchIn, setRegex } from '~/store/searchSlice'

const MoreActionsMenu = () => {
    const dispatch = useDispatch()
    const { tabs } = useSelector((state: any) => state.tabs)

    const duplicateCount = useMemo(() => {
        const urlCounts: Record<string, number> = {}
        tabs.forEach((tab: any) => {
            urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1
        })
        return Object.values(urlCounts).reduce((acc, count) => acc + (count > 1 ? count : 0), 0)
    }, [tabs])

    const handleHighlightDuplicates = () => {
        // 1. Identify duplicates
        const urlCounts: Record<string, number> = {}
        tabs.forEach((tab: any) => {
            urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1
        })

        const duplicateUrls = Object.keys(urlCounts).filter(url => urlCounts[url] > 1)

        if (duplicateUrls.length === 0) {
            // No duplicates found
            return
        }

        // 2. Create a regex to match any of these URLs
        // We need to escape special regex characters in the URLs
        const escapedUrls = duplicateUrls.map(url => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        const regexPattern = `(${escapedUrls.join('|')})`

        // 3. Update search state to filter by this regex
        dispatch(setRegex(true))
        dispatch(updateSearchTerm(regexPattern))
        dispatch(toggleSearchIn({ title: false, url: true }))
    }

    const items: MenuProps['items'] = [
        {
            key: 'highlight-duplicates',
            label: `Highlight Duplicates (${duplicateCount})`,
            icon: <Copy size={14} />,
            onClick: handleHighlightDuplicates,
            disabled: duplicateCount === 0,
        },
    ]

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Btn className="flex items-center justify-center px-2">
                <Badge count={duplicateCount} size="small" offset={[0, -5]}>
                    <MoreVertical size={16} />
                </Badge>
            </Btn>
        </Dropdown>
    )
}

export default MoreActionsMenu
