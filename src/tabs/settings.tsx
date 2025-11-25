import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Card, Radio, Space, Typography, message, ConfigProvider } from 'antd';
import Sidebar, { SidebarToggleButton } from '~/components/Sidebar';
import Brand from '~/components/Header/Brand';
import logo from '~/assets/logo.svg';
import store from '~/store/store';
import { usePageTracking } from '~/components/Analytics/usePageTracking';
import 'antd/dist/reset.css';
import '~/styles/index.css';
import '~/styles/index.scss';

const { Title, Text } = Typography;

function SettingsPageContent() {
    const [sessionsView, setSessionsView] = useState<'compact' | 'expanded'>('compact');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    usePageTracking('/settings', 'Settings');

    useEffect(() => {
        chrome.storage.local.get(['sessionsView'], (result) => {
            if (result.sessionsView) {
                setSessionsView(result.sessionsView);
            }
        });
    }, []);

    const handleSessionsViewChange = (value: 'compact' | 'expanded') => {
        setSessionsView(value);
        chrome.storage.local.set({ sessionsView: value }, () => {
            message.success('Settings saved');
        });
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
                        <Card title="Sessions Display" className="mb-4">
                            <Space direction="vertical" size="large" className="w-full">
                                <div>
                                    <Text strong>Default View Mode</Text>
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
