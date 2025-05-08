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

// 기본 API 서버 주소
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const App = () => {
    const [data, setData] = useState([]);
    const startTimeRef = useRef(null);

    // 1. 히스토리컬 습도 데이터 조회 및 초기 로드
    useEffect(() => {
        const fetchHistorical = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/farm/humidity`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ size: 50, page: 0, sort: 'asc' }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                const items = json.content;
                if (items.length === 0) return;
                const initialTime = new Date(items[0].measuredAt).getTime();
                startTimeRef.current = initialTime;
                const histData = items.map(item => {
                    const measured = new Date(item.measuredAt).getTime();
                    const time = Math.floor((measured - initialTime) / 1000);
                    return { time, humidity: item.value };
                });
                setData(histData);
            } catch (error) {
                console.error('Error fetching historical humidity data:', error);
            }
        };
        fetchHistorical();
    }, []);

    // 2. 실시간 습도 데이터 SSE 구독 후 기존 데이터에 이어붙이기
    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/subscribe/humidity`);

        eventSource.addEventListener('humidity_data', event => {
            try {
                let parsed;
                try {
                    parsed = JSON.parse(event.data);
                } catch {
                    parsed = { value: parseFloat(event.data), measuredAt: new Date().toISOString() };
                }
                const measured = new Date(parsed.measuredAt).getTime();
                if (startTimeRef.current === null) {
                    startTimeRef.current = measured;
                }
                const time = Math.floor((measured - startTimeRef.current) / 1000);
                setData(prev => {
                    const next = [...prev, { time, humidity: parsed.value }];
                    // 최대 50포인트 유지
                    return next.length > 50 ? next.slice(next.length - 50) : next;
                });
            } catch (err) {
                console.error('Error parsing SSE data:', err);
            }
        });

        eventSource.onerror = error => {
            console.error('SSE error:', error);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    // X축 도메인 계산
    const dataMin = data.length > 0 ? data[0].time : 0;
    const dataMax = data.length > 0 ? data[data.length - 1].time : 50;

    const renderHumidityDot = ({ cx, cy, value }) => {
        const isOutlier = value < 30 || value > 70;
        return <circle cx={cx} cy={cy} r={isOutlier ? 6 : 3} fill={isOutlier ? 'red' : 'green'} />;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>실시간 센서 데이터 시각화</h1>
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
                        domain={[dataMin, dataMax]}
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
        </div>
    );
};

export default App;