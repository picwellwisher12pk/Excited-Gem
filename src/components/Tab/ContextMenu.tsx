import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';

interface TabContextMenuProps {
    children: React.ReactNode;
    tab: any;
}

export const TabContextMenu: React.FC<TabContextMenuProps> = ({ children, tab }) => {

    const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
        const tabId = tab.id;
        try {
            switch (key) {
                case 'pin':
                    await chrome.tabs.update(tabId, { pinned: !tab.pinned });
                    break;
                case 'mute':
                    await chrome.tabs.update(tabId, { muted: !tab.mutedInfo?.muted });
                    break;
                case 'discard':
                    await chrome.tabs.discard(tabId);
                    break;
                case 'close':
                    await chrome.tabs.remove(tabId);
                    break;
                case 'newWindow':
                    await chrome.windows.create({ tabId: tabId, focused: true });
                    break;
            }
        } catch (error) {
            console.error("Context menu action failed:", error);
        }
    };

    const items: MenuProps['items'] = [
        {
            key: 'pin',
            label: tab.pinned ? 'Unpin Tab' : 'Pin Tab',
        },
        {
            key: 'mute',
            label: tab.mutedInfo?.muted ? 'Unmute Tab' : 'Mute Tab',
        },
        {
            key: 'discard',
            label: 'Discard Tab',
            disabled: tab.discarded,
        },
        {
            type: 'divider',
        },
        {
            key: 'newWindow',
            label: 'Move to New Window',
        },
        {
            type: 'divider',
        },
        {
            key: 'close',
            label: 'Close Tab',
            danger: true,
        },
    ];

    return (
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['contextMenu']}>
            <div style={{ display: 'contents' }}>
                {children}
            </div>
        </Dropdown>
    );
};
