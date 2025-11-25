import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { AppstoreOutlined, FolderOutlined, SettingOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface SidebarProps {
    currentPage: 'tabs' | 'sessions' | 'settings';
    collapsed?: boolean;
    onToggle?: () => void;
}

export function SidebarToggleButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={onClick}
            style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff'
            }}
        />
    );
}

export default function Sidebar({ currentPage, collapsed: externalCollapsed, onToggle }: SidebarProps) {
    const [internalCollapsed, setInternalCollapsed] = useState(true);
    const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalCollapsed(!internalCollapsed);
        }
    };

    const items: MenuProps['items'] = [
        {
            key: 'tabs',
            icon: <AppstoreOutlined />,
            label: <a href="/tabs/home.html">Tabs</a>,
        },
        {
            key: 'sessions',
            icon: <FolderOutlined />,
            label: <a href="/tabs/sessions.html">Sessions</a>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <a href="/tabs/settings.html">Settings</a>,
        },
    ];

    return (
        <>
            {/* Overlay */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 to-indigo-600 shadow-lg transition-transform duration-300 z-40 ${collapsed ? '-translate-x-full' : 'translate-x-0'
                    }`}
                style={{ width: '240px' }}
            >
                <div className="flex justify-between items-center p-4 border-b border-white/20">
                    <h2 className="text-white font-semibold text-lg">Menu</h2>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={handleToggle}
                        className="!text-white hover:!bg-white/10"
                    />
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[currentPage]}
                    items={items}
                    className="!bg-transparent !border-0 pt-4"
                    theme="dark"
                />
            </div>
        </>
    );
}
