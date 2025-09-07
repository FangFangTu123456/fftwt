import React, { useState } from 'react';

const SettingsItem = ({ icon, title, subtitle, onClick }) => (
    <div onClick={onClick} className={`flex items-center p-4 rounded-lg ${onClick ? 'hover:bg-gray-200/50 cursor-pointer' : ''}`}>
        <span className="text-2xl mr-4">{icon}</span>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
    </div>
);

const SystemView = ({ onBack }) => (
    <div>
        <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">{'<'} 返回</button>
        <h2 className="text-2xl font-bold mb-6">系统 > 关于</h2>
        <div className="space-y-4 bg-white/50 p-6 rounded-lg">
            <div>
                <h3 className="font-semibold">设备名称</h3>
                <p className="text-gray-700">WebApp-PC</p>
            </div>
            <div>
                <h3 className="font-semibold">处理器</h3>
                <p className="text-gray-700">Emulated ARM64 (Running in Browser)</p>
            </div>
            <div>
                <h3 className="font-semibold">已安装的 RAM</h3>
                <p className="text-gray-700">Browser Allocated Memory</p>
            </div>
            <div>
                <h3 className="font-semibold">系统类型</h3>
                <p className="text-gray-700">64-bit operating system, Web-based processor</p>
            </div>
            <hr className="my-4" />
            <h3 className="text-xl font-bold mb-2">Windows 规格</h3>
            <div>
                <h3 className="font-semibold">版本</h3>
                <p className="text-gray-700">WebTools12</p>
            </div>
            <div>
                <h3 className="font-semibold">版本号</h3>
                <p className="text-gray-700">24H1</p>
            </div>
             <div>
                <h3 className="font-semibold">安装日期</h3>
                <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
            </div>
        </div>
    </div>
);


const MainSettingsView = ({ onNavigate, onChangeBackground }) => (
    <div>
        <h1 className="text-4xl font-bold mb-8">设置</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SettingsItem icon="🖥️" title="系统" subtitle="显示、声音、通知" onClick={() => onNavigate('system')} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="📶" title="网络和 Internet" subtitle="WLAN、飞行模式、VPN" onClick={null} />
            <div onClick={onChangeBackground} className="rounded-lg">
                <SettingsItem icon="🎨" title="个性化" subtitle="背景、锁屏、颜色" onClick={onChangeBackground} />
            </div>
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="📱" title="应用" subtitle="卸载、默认值、可选功能" onClick={null} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="🔒" title="隐私和安全" subtitle="权限、查找我的设备" onClick={null} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="🎮" title="游戏" subtitle="Xbox Game Bar、截图、游戏模式" onClick={null} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="⏰" title="时间和语言" subtitle="语音、区域、日期" onClick={null} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="♿" title="辅助功能" subtitle="讲述人、放大镜、高对比度" onClick={null} />
            {/* FIX: Added missing onClick prop to satisfy component requirements. */}
            <SettingsItem icon="🔄" title="Windows 更新" subtitle="更新历史记录、高级选项" onClick={null} />
        </div>
    </div>
);

const Settings = ({ onChangeBackground }) => {
    const [view, setView] = useState('main');

    const renderView = () => {
        switch (view) {
            case 'system':
                return <SystemView onBack={() => setView('main')} />;
            case 'main':
            default:
                return <MainSettingsView onNavigate={setView} onChangeBackground={onChangeBackground} />;
        }
    };

    return (
        <div className="w-full h-full bg-gray-100 p-8 overflow-y-auto">
            {renderView()}
        </div>
    );
};

export default Settings;