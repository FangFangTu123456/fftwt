import React, { useState, useEffect } from 'react';

// Sub-components for widgets
// FIX: Made the 'title' prop optional by providing a default value to fix a missing prop error.
const Widget = ({ title = null, children, className = '' }) => (
    <div className={`bg-black/60 rounded-lg p-3 backdrop-blur-sm ${className}`}>
        {title && <h3 className="text-white text-xs font-bold uppercase mb-2 tracking-wider">{title}</h3>}
        {children}
    </div>
);

const PerformanceMeter = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
    </div>
);

const CaptureButton = ({ icon, label }) => (
    <button onClick={() => alert(`${label} (模拟)`)} className="flex flex-col items-center justify-center space-y-1 text-white hover:bg-white/10 p-2 rounded-md transition-colors">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs">{label}</span>
    </button>
);


const XboxGameBar = () => {
    const [time, setTime] = useState(new Date());
    const [performance, setPerformance] = useState({
        cpu: Math.floor(Math.random() * 30) + 10,
        gpu: Math.floor(Math.random() * 40) + 20,
        ram: Math.floor(Math.random() * 20) + 40,
    });

    useEffect(() => {
        const timeInterval = setInterval(() => setTime(new Date()), 1000);
        const perfInterval = setInterval(() => {
            setPerformance({
                cpu: Math.floor(Math.random() * 30) + 10,
                gpu: Math.floor(Math.random() * 40) + 20,
                ram: Math.floor(Math.random() * 20) + 40,
            })
        }, 2000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(perfInterval);
        };
    }, []);

    return (
        <div className="w-full h-full bg-transparent text-white p-4 font-sans flex items-start justify-center">
            <div className="flex items-start space-x-2">
                
                {/* Time/Welcome Widget */}
                <Widget className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-xl">G</div>
                    <div>
                        <div className="text-lg font-semibold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-xs text-gray-300">游戏玩家</div>
                    </div>
                </Widget>
                
                {/* Performance Widget */}
                <Widget title="性能">
                    <div className="space-y-1 w-40">
                       <PerformanceMeter label="CPU" value={performance.cpu} />
                       <PerformanceMeter label="GPU" value={performance.gpu} />
                       <PerformanceMeter label="RAM" value={performance.ram} />
                    </div>
                </Widget>

                {/* Capture Widget */}
                <Widget title="捕获">
                    <div className="flex space-x-2">
                       <CaptureButton icon="📸" label="截屏" />
                       <CaptureButton icon="📹" label="录制" />
                    </div>
                </Widget>
                
                {/* Audio Widget */}
                <Widget title="音频">
                    <div className="w-48 text-sm space-y-2">
                        <div>混合 - 扬声器</div>
                        <div>语音 - 扬声器</div>
                    </div>
                </Widget>
                
                {/* Settings button */}
                <button className="bg-black/60 rounded-lg p-3 h-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="text-2xl">⚙️</span>
                </button>

            </div>
        </div>
    );
};

export default XboxGameBar;