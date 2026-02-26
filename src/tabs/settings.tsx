import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Card, Radio, Space, Typography, message, ConfigProvider, Checkbox, Input, Button, Divider } from 'antd';
import { GoogleOutlined, CloudSyncOutlined, CloudDownloadOutlined, KeyOutlined } from '@ant-design/icons';
import { loginAndGetProfile, logout, UserProfile } from '~/utils/auth';
import { backupToDrive, restoreFromDrive } from '~/utils/drive';
import Sidebar, { SidebarToggleButton } from '~/components/Sidebar';
import Brand from '~/components/Header/Brand';
import logo from '~/assets/logo.svg';
import store from '~/store/store';
import { usePageTracking } from '~/components/Analytics/usePageTracking';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRegex, toggleSearchIn } from '~/store/searchSlice';
import 'antd/dist/reset.css';
import '~/styles/index.css';

const { Title, Text } = Typography;

function SettingsPageContent() {
    const dispatch = useDispatch();
    const { regex, searchIn } = useSelector((state: any) => state.search);
    const [sessionsView, setSessionsView] = useState<'compact' | 'expanded'>('compact');
    const [displayMode, setDisplayMode] = useState<'sidebar' | 'tab' | 'popup'>('sidebar');
    const [tabManagementMode, setTabManagementMode] = useState<'single' | 'per-window'>('single');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [searchBehavior, setSearchBehavior] = useState<'debounce' | 'enter'>('debounce');
    const [groupedTabs, setGroupedTabs] = useState(true);
    const [tabActionButtons, setTabActionButtons] = useState<'always' | 'hover'>('hover');
    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    usePageTracking('/settings', 'Settings');

    useEffect(() => {
        chrome.storage.local.get(['sessionsView', 'displayMode', 'tabManagementMode', 'searchBehavior', 'groupedTabs', 'tabActionButtons', 'youtubeApiKey', 'userProfile'], (result) => {
            if (result.sessionsView) setSessionsView(result.sessionsView);
            if (result.displayMode) setDisplayMode(result.displayMode);
            if (result.tabManagementMode) setTabManagementMode(result.tabManagementMode);
            if (result.searchBehavior) setSearchBehavior(result.searchBehavior);
            if (result.groupedTabs !== undefined) setGroupedTabs(result.groupedTabs);
            if (result.tabActionButtons) setTabActionButtons(result.tabActionButtons);
            if (result.youtubeApiKey) setYoutubeApiKey(result.youtubeApiKey);
            if (result.userProfile) setUserProfile(result.userProfile);
        });
    }, []);

    const handleSearchBehaviorChange = (value: 'debounce' | 'enter') => {
        setSearchBehavior(value);
        chrome.storage.local.set({ searchBehavior: value }, () => {
            message.success('Search behavior saved');
        });
    };

    const handleSessionsViewChange = (value: 'compact' | 'expanded') => {
        setSessionsView(value);
        chrome.storage.local.set({ sessionsView: value }, () => {
            message.success('Settings saved');
        });
    };

    const handleDisplayModeChange = (value: 'sidebar' | 'tab' | 'popup') => {
        setDisplayMode(value);
        chrome.storage.local.set({ displayMode: value }, () => {
            message.success('Display mode saved');
        });
    };

    const handleTabManagementModeChange = (value: 'single' | 'per-window') => {
        setTabManagementMode(value);
        chrome.storage.local.set({ tabManagementMode: value }, () => {
            message.success('Tab management mode saved');
        });
    };

    const handleGroupedTabsChange = (value: boolean) => {
        setGroupedTabs(value);
        chrome.storage.local.set({ groupedTabs: value }, () => {
            message.success('Grouped tabs setting saved');
        });
    };

    const handleTabActionButtonsChange = (value: 'always' | 'hover') => {
        setTabActionButtons(value);
        chrome.storage.local.set({ tabActionButtons: value }, () => {
            message.success('Tab action buttons setting saved');
        });
    };

    const handleYoutubeApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setYoutubeApiKey(val);
        chrome.storage.local.set({ youtubeApiKey: val }, () => {
            message.success('YouTube API Key saved');
        });
    };

    const handleLogin = async () => {
        try {
            const { profile } = await loginAndGetProfile();
            setUserProfile(profile);
            chrome.storage.local.set({ userProfile: profile });
            message.success('Successfully logged in');
        } catch (err) {
            message.error('Login failed');
        }
    };

    const handleLogout = async () => {
        await logout();
        setUserProfile(null);
        chrome.storage.local.remove('userProfile');
        message.success('Logged out');
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            const data = await chrome.storage.local.get(null);
            await backupToDrive(data);
            message.success('Successfully backed up to Google Drive');
        } catch (err) {
            message.error('Backup failed');
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const data = await restoreFromDrive();
            if (data) {
                await chrome.storage.local.set(data);
                message.success('Successfully restored from Google Drive');
            } else {
                message.info('No backup found');
            }
        } catch (err) {
            message.error('Restore failed');
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="flex h-[100vh] relative overflow-hidden">
            <Sidebar
                currentPage="settings"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className="flex flex-col flex-1">
                <header className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out">
                    <section className="flex items-center">
                        <div className="mr-2">
                            <SidebarToggleButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
                        </div>
                        {Brand(logo)}
                        <div className="flex items-center ml-4">
                            <span className="text-white font-semibold text-lg">Settings</span>
                        </div>
                        <div className="flex-1" />
                    </section>
                </header>

                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    <div className="max-w-3xl mx-auto">
                        <Card title="Display Settings" className="mb-4">
                            <Space direction="vertical" size="large" className="w-full">
                                <div>
                                    <Text strong>Extension Display Mode</Text>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={displayMode}
                                            onChange={(e) => handleDisplayModeChange(e.target.value)}
                                        >
                                            <Space direction="vertical">
                                                <Radio value="sidebar">
                                                    <div>
                                                        <div className="font-medium">Sidebar</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Open in browser sidebar
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value="tab">
                                                    <div>
                                                        <div className="font-medium">Tab</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Open in a new tab
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value="popup">
                                                    <div>
                                                        <div className="font-medium">Popup</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Open as a popup
                                                        </Text>
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </div>

                                {displayMode === 'tab' && (
                                    <div>
                                        <Text strong>Tab Management Mode</Text>
                                        <div className="mt-2">
                                            <Radio.Group
                                                value={tabManagementMode}
                                                onChange={(e) => handleTabManagementModeChange(e.target.value)}
                                            >
                                                <Space direction="vertical">
                                                    <Radio value="single">
                                                        <div>
                                                            <div className="font-medium">Single Extension Tab</div>
                                                            <Text type="secondary" className="text-xs">
                                                                Maintain one extension tab across all windows
                                                            </Text>
                                                        </div>
                                                    </Radio>
                                                    <Radio value="per-window">
                                                        <div>
                                                            <div className="font-medium">Per Window</div>
                                                            <Text type="secondary" className="text-xs">
                                                                Allow one extension tab per browser window
                                                            </Text>
                                                        </div>
                                                    </Radio>
                                                </Space>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Text strong>Sessions View Mode</Text>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={sessionsView}
                                            onChange={(e) => handleSessionsViewChange(e.target.value)}
                                        >
                                            <Space direction="vertical">
                                                <Radio value="compact">
                                                    <div>
                                                        <div className="font-medium">Compact</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Single-line view with expand option (recommended)
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value="expanded">
                                                    <div>
                                                        <div className="font-medium">Expanded</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Show all tabs by default
                                                        </Text>
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Group Tabs by Window</Text>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={groupedTabs}
                                            onChange={(e) => handleGroupedTabsChange(e.target.value)}
                                        >
                                            <Space direction="vertical">
                                                <Radio value={true}>
                                                    <div>
                                                        <div className="font-medium">Enabled</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Group tabs by window when "All windows" is selected
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value={false}>
                                                    <div>
                                                        <div className="font-medium">Disabled</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Show tabs as a flat list
                                                        </Text>
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Tab Action Buttons</Text>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={tabActionButtons}
                                            onChange={(e) => handleTabActionButtonsChange(e.target.value)}
                                        >
                                            <Space direction="vertical">
                                                <Radio value="hover">
                                                    <div>
                                                        <div className="font-medium">On Hover</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Show buttons only when hovering over the tab
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value="always">
                                                    <div>
                                                        <div className="font-medium">Always Visible</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Always show action buttons
                                                        </Text>
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </div>
                            </Space>
                        </Card>

                        <Card title="Integrations & Sync" className="mb-4">
                            <Space direction="vertical" size="large" className="w-full">
                                <div>
                                    <Text strong>Google Account Sync</Text>
                                    <div className="mt-2">
                                        {userProfile ? (
                                            <Space direction="vertical" className="w-full">
                                                <div className="flex items-center gap-3 p-3 bg-white rounded border border-gray-200">
                                                    <img src={userProfile.picture} alt="Profile" className="w-10 h-10 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{userProfile.name}</div>
                                                        <div className="text-xs text-gray-500">{userProfile.email}</div>
                                                    </div>
                                                    <Button onClick={handleLogout} size="small">Sign Out</Button>
                                                </div>
                                                <Space className="mt-2">
                                                    <Button
                                                        icon={<CloudSyncOutlined />}
                                                        onClick={handleBackup}
                                                        loading={isBackingUp}
                                                        type="primary"
                                                    >
                                                        Backup Settings & Sessions
                                                    </Button>
                                                    <Button
                                                        icon={<CloudDownloadOutlined />}
                                                        onClick={handleRestore}
                                                        loading={isRestoring}
                                                    >
                                                        Restore from Backup
                                                    </Button>
                                                </Space>
                                            </Space>
                                        ) : (
                                            <Button
                                                icon={<GoogleOutlined />}
                                                onClick={handleLogin}
                                            >
                                                Sign in with Google
                                            </Button>
                                        )}
                                        <div className="mt-2">
                                            <Text type="secondary" className="text-xs">
                                                Securely back up your saved tabs and settings to your Google Drive.
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                                <Divider className="my-2" />
                                <div>
                                    <Text strong>YouTube API Key (Optional BYOK)</Text>
                                    <div className="mt-2">
                                        <Input.Password
                                            prefix={<KeyOutlined className="text-gray-400" />}
                                            placeholder="AIzaSy..."
                                            value={youtubeApiKey}
                                            onChange={handleYoutubeApiKeyChange}
                                        />
                                        <div className="mt-2">
                                            <Text type="secondary" className="text-xs">
                                                Provide your own Google Cloud YouTube Data API v3 key to enable rich data fetching for unloaded YouTube tabs.
                                                <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noreferrer" className="ml-1 text-blue-500 hover:underline">Learn how to get one</a>.
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Space>
                        </Card>

                        <Card title="Search Settings" className="mb-4">
                            <Space direction="vertical" size="large" className="w-full">
                                <div>
                                    <Text strong>Search Behavior</Text>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={searchBehavior}
                                            onChange={(e) => handleSearchBehaviorChange(e.target.value)}
                                        >
                                            <Space direction="vertical">
                                                <Radio value="debounce">
                                                    <div>
                                                        <div className="font-medium">As you type</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Search automatically while typing (debounced)
                                                        </Text>
                                                    </div>
                                                </Radio>
                                                <Radio value="enter">
                                                    <div>
                                                        <div className="font-medium">On Enter</div>
                                                        <Text type="secondary" className="text-xs">
                                                            Search only when pressing Enter
                                                        </Text>
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Search in</Text>
                                    <div className="mt-2">
                                        <Space>
                                            <Checkbox
                                                checked={searchIn.title}
                                                onChange={() => dispatch(toggleSearchIn({ ...searchIn, title: !searchIn.title }))}
                                            >
                                                Title
                                            </Checkbox>
                                            <Checkbox
                                                checked={searchIn.url}
                                                onChange={() => dispatch(toggleSearchIn({ ...searchIn, url: !searchIn.url }))}
                                            >
                                                URL
                                            </Checkbox>
                                        </Space>
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Regular Expression Search</Text>
                                    <div className="mt-2">
                                        <Space>
                                            <Radio.Group value={regex} onChange={() => dispatch(toggleRegex())}>
                                                <Radio value={true}>Enabled</Radio>
                                                <Radio value={false}>Disabled</Radio>
                                            </Radio.Group>
                                        </Space>
                                    </div>
                                </div>
                            </Space>
                        </Card>

                        <Card title="About" className="mb-4">
                            <Space direction="vertical">
                                <div>
                                    <Text strong>Excited Gem</Text>
                                    <div><Text type="secondary">Version 1.0.0</Text></div>
                                </div>
                                <div>
                                    <Text type="secondary">
                                        A powerful tab management extension for Chrome
                                    </Text>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Text type="secondary" className="text-xs">
                                        <strong>Privacy Notice:</strong> This extension collects anonymous usage analytics
                                        to help improve the product. No personal information is collected.
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Provider store={store}>
            <ConfigProvider theme={{
                token: {
                    borderRadius: 4,
                    borderRadiusSM: 4,
                    borderRadiusLG: 4
                }
            }}>
                <SettingsPageContent />
            </ConfigProvider>
        </Provider>
    );
}
