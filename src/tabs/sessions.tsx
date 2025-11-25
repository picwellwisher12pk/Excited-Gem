import React, { useEffect, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import { Button, Input, Space, List, Tag, Tooltip, Popconfirm, message, ConfigProvider, Checkbox } from 'antd';
import {
    SaveOutlined,
    FolderOpenOutlined,
    DeleteOutlined,
    SearchOutlined,
    DownloadOutlined,
    UploadOutlined,
    CloseOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
// @ts-ignore
import { getSessions, saveSessions, removeSessions, removeTab, exportSessions, importSessions } from '~/components/getsetSessions';
import Sidebar, { SidebarToggleButton } from '~/components/Sidebar';
import Brand from '~/components/Header/Brand';
import logo from '~/assets/logo.svg';
import store from '~/store/store';
import 'antd/dist/reset.css';
import '~/styles/index.css';
import '~/styles/index.scss';

interface TabData {
    url: string;
    title: string;
}

interface SessionData {
    created: number;
    name?: string;
    windows: {
        [key: string]: TabData[];
    };
}

const { Search } = Input;

function SessionsPageContent() {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
        sessionName: true,
        tabUrl: true,
        tabTitle: true
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const items: any = await getSessions();
            setSessions(items || []);
            setFilteredSessions(items || []);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCurrentSession = async () => {
        setSaveLoading(true);
        try {
            await saveSessions();
            await fetchSessions();
            message.success('Session saved successfully');
        } catch (error) {
            message.error('Failed to save session');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleRestore = (url?: string, sessionData?: SessionData) => {
        if (url) {
            chrome.tabs.create({ url });
        } else if (sessionData) {
            Object.values(sessionData.windows).flat().forEach(tab => {
                chrome.tabs.create({ url: tab.url });
            });
            message.success('Session restored');
        }
    };

    const handleDelete = async (sessionId: number) => {
        await removeSessions(sessionId);
        await fetchSessions();
        message.success('Session deleted');
    };

    const handleRemoveUrl = async (sessionId: number, windowId: string, url: string) => {
        await removeTab(url, windowId, sessionId);
        await fetchSessions();
        message.success('URL removed');
    };

    const handleExport = async () => {
        try {
            const data = await exportSessions();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `sessions-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            message.success('Sessions exported');
        } catch (error) {
            message.error('Failed to export sessions');
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                await importSessions(imported, true);
                await fetchSessions();
                message.success('Sessions imported successfully');
            } catch (error) {
                message.error('Failed to import sessions');
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (!value.trim()) {
            setFilteredSessions(sessions);
            return;
        }

        const query = value.toLowerCase();
        const filtered = sessions.filter(session => {
            if (searchFilters.sessionName && session.name?.toLowerCase().includes(query)) {
                return true;
            }

            if (searchFilters.tabUrl || searchFilters.tabTitle) {
                return Object.values(session.windows).some(tabs =>
                    tabs.some(tab => {
                        if (searchFilters.tabUrl && tab.url.toLowerCase().includes(query)) return true;
                        if (searchFilters.tabTitle && tab.title.toLowerCase().includes(query)) return true;
                        return false;
                    })
                );
            }

            return false;
        });
        setFilteredSessions(filtered);
    };

    const toggleExpand = (sessionId: number) => {
        const newExpanded = new Set(expandedSessions);
        if (newExpanded.has(sessionId)) {
            newExpanded.delete(sessionId);
        } else {
            newExpanded.add(sessionId);
        }
        setExpandedSessions(newExpanded);
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            handleSearch(searchQuery);
        }
    }, [searchFilters]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalTabs = (session: SessionData) => {
        return Object.values(session.windows).reduce((sum, tabs) => sum + tabs.length, 0);
    };

    return (
        <div className="flex h-[100vh] relative overflow-hidden">
            <Sidebar
                currentPage="sessions"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className="flex flex-col flex-1">
                {/* Header matching Tabs page structure */}
                <header className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out">
                    <section className="flex items-center">
                        <div className="mr-2">
                            <SidebarToggleButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
                        </div>
                        {Brand(logo)}
                        <div className="flex items-center ml-4">
                            <span className="text-white font-semibold text-lg">Sessions</span>
                            {sessions.length > 0 && (
                                <span className="ml-2 text-white/80 text-sm">({sessions.length})</span>
                            )}
                        </div>
                        <div className="flex-1" />
                    </section>

                    {/* Secondary header row for actions */}
                    <section className="flex flex-row justify-between items-center mt-1">
                        <div className="flex items-center space-x-3 flex-1 max-w-2xl">
                            <Search
                                placeholder="Search sessions..."
                                allowClear
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                prefix={<SearchOutlined />}
                                className="flex-1"
                            />
                            <Space size="small" className="bg-white/10 px-2 py-1 rounded">
                                <Checkbox
                                    checked={searchFilters.sessionName}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, sessionName: e.target.checked })}
                                    className="!text-white"
                                >
                                    <span className="text-white text-xs">Name</span>
                                </Checkbox>
                                <Checkbox
                                    checked={searchFilters.tabUrl}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, tabUrl: e.target.checked })}
                                >
                                    <span className="text-white text-xs">URL</span>
                                </Checkbox>
                                <Checkbox
                                    checked={searchFilters.tabTitle}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, tabTitle: e.target.checked })}
                                >
                                    <span className="text-white text-xs">Title</span>
                                </Checkbox>
                            </Space>
                        </div>

                        <Space>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={saveLoading}
                                onClick={handleSaveCurrentSession}
                                ghost
                            >
                                Save
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={handleExport}
                                disabled={sessions.length === 0}
                                ghost
                            >
                                Export
                            </Button>
                            <Button
                                icon={<UploadOutlined />}
                                onClick={() => fileInputRef.current?.click()}
                                ghost
                            >
                                Import
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                        </Space>
                    </section>
                </header>

                {/* Sessions List */}
                <div className="flex-1 overflow-auto bg-gray-50 p-4">
                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {searchQuery ? 'No sessions found' : 'No saved sessions yet'}
                        </div>
                    ) : (
                        <List
                            dataSource={filteredSessions}
                            renderItem={(session) => {
                                const totalTabs = getTotalTabs(session);
                                const isExpanded = expandedSessions.has(session.created);

                                return (
                                    <div key={session.created} className="bg-white rounded mb-2 shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(session.created)}>
                                            <div className="flex items-center space-x-3 flex-1">
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                                                />
                                                <span className="font-medium">{session.name || 'Unnamed Session'}</span>
                                                <Tag color="blue">{formatDate(session.created)}</Tag>
                                                <Tag color="green">{totalTabs} tabs</Tag>
                                            </div>
                                            <Space size="small">
                                                <Tooltip title="Restore all">
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        icon={<FolderOpenOutlined />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRestore(undefined, session);
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Popconfirm
                                                    title="Delete this session?"
                                                    onConfirm={(e) => {
                                                        e?.stopPropagation();
                                                        handleDelete(session.created);
                                                    }}
                                                    okText="Delete"
                                                    cancelText="Cancel"
                                                >
                                                    <Button
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t px-4 py-3 bg-gray-50">
                                                {Object.keys(session.windows).map((winId, winIndex) => (
                                                    <div key={winId} className="mb-3">
                                                        <div className="text-xs text-gray-500 mb-1">
                                                            Window {winIndex + 1} ({session.windows[winId].length} tabs)
                                                        </div>
                                                        <div className="space-y-1">
                                                            {session.windows[winId].map((tab, tabIndex) => (
                                                                <div
                                                                    key={tabIndex}
                                                                    className="flex items-center justify-between bg-white px-3 py-1.5 rounded text-sm hover:bg-blue-50"
                                                                >
                                                                    <div className="flex-1 truncate">
                                                                        <a
                                                                            href={tab.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline"
                                                                        >
                                                                            {tab.title || tab.url}
                                                                        </a>
                                                                    </div>
                                                                    <Space size="small">
                                                                        <Button
                                                                            type="link"
                                                                            size="small"
                                                                            onClick={() => handleRestore(tab.url)}
                                                                        >
                                                                            Open
                                                                        </Button>
                                                                        <Popconfirm
                                                                            title="Remove this URL?"
                                                                            onConfirm={() => handleRemoveUrl(session.created, winId, tab.url)}
                                                                            okText="Remove"
                                                                            cancelText="Cancel"
                                                                        >
                                                                            <Button
                                                                                type="text"
                                                                                size="small"
                                                                                danger
                                                                                icon={<CloseOutlined />}
                                                                            />
                                                                        </Popconfirm>
                                                                    </Space>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SessionsPage() {
    return (
        <Provider store={store}>
            <ConfigProvider theme={{
                token: {
                    borderRadius: 4,
                    borderRadiusSM: 4,
                    borderRadiusLG: 4
                }
            }}>
                <SessionsPageContent />
            </ConfigProvider>
        </Provider>
    );
}
