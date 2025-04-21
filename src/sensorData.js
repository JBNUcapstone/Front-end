import React, { useState, useEffect, useRef } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const App = () => {
    const [data, setData] = useState([]);
    const timeRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            timeRef.current += 1;
            let temperature = Math.floor(Math.random() * 30) + 5;   // 5~35°C
            let humidity    = Math.floor(Math.random() * 50) + 30;  // 30~80%
            let soil        = Math.floor(Math.random() * 60) + 20;  // 20~80%

            // 10% 확률로 이상치 삽입
            if (Math.random() < 0.1) temperature += (temperature < 10 ? -10 : 10);
            if (Math.random() < 0.1) humidity    += (humidity    < 40 ? -20 : 20);
            if (Math.random() < 0.1) soil        += (soil        < 40 ? -20 : 20);

            const newPoint = {
                time: timeRef.current,
                temperature,
                humidity,
                soil,
            };

            setData(prev => {
                const next = [...prev, newPoint];
                if (next.length > 50) next.shift();
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderTemperatureDot = ({ cx, cy, value }) => {
        const isOutlier = value < 10 || value > 35;
        return <circle cx={cx} cy={cy} r={isOutlier ? 6 : 3} fill={isOutlier ? 'red' : 'blue'} />;
    };
    const renderHumidityDot = ({ cx, cy, value }) => {
        const isOutlier = value < 30 || value > 70;
        return <circle cx={cx} cy={cy} r={isOutlier ? 6 : 3} fill={isOutlier ? 'red' : 'green'} />;
    };
    const renderSoilDot = ({ cx, cy, value }) => {
        const isOutlier = value < 20 || value > 80;
        return <circle cx={cx} cy={cy} r={isOutlier ? 6 : 3} fill={isOutlier ? 'red' : 'brown'} />;
    };

    const minTime = data.length > 0 ? data[0].time : 0;
    const maxTime = data.length > 0 ? data[data.length - 1].time : 50;

    return (
        <div style={{ padding: '20px' }}>
            <h1>실시간 센서 데이터 시각화</h1>

            {/* 온도 (°C) */}
            <h2>온도 (°C)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={[minTime, maxTime]}
                        allowDataOverflow
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={tick => `${tick}s`}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip isAnimationActive={false} />
                    <Area
                        type="linear"
                        dataKey="temperature"
                        stroke="#8884d8"
                        fill="url(#gradTemp)"
                        dot={renderTemperatureDot}
                        isAnimationActive={false}
                        animationDuration={0}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* 습도 (%) */}
            <h2>습도 (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={[minTime, maxTime]}
                        allowDataOverflow
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={tick => `${tick}s`}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip isAnimationActive={false} />
                    <Area
                        type="linear"
                        dataKey="humidity"
                        stroke="#82ca9d"
                        fill="url(#gradHum)"
                        dot={renderHumidityDot}
                        isAnimationActive={false}
                        animationDuration={0}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* 토양습도 (%) */}
            <h2>토양습도 (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradSoil" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={[minTime, maxTime]}
                        allowDataOverflow
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={tick => `${tick}s`}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip isAnimationActive={false} />
                    <Area
                        type="linear"
                        dataKey="soil"
                        stroke="#ffc658"
                        fill="url(#gradSoil)"
                        dot={renderSoilDot}
                        isAnimationActive={false}
                        animationDuration={0}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default App;
