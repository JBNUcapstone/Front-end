import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const App = () => {
    const [data, setData] = useState([]);
    // 시간을 추적하기 위한 ref 변수
    const timeRef = useRef(0);

    useEffect(() => {
        // 1초마다 새 데이터 포인트 생성
        const interval = setInterval(() => {
            timeRef.current += 1;

            // 기본 범위 내 랜덤값 생성
            let temperature = Math.floor(Math.random() * 30) + 5;  // 5 ~ 35°C
            let humidity = Math.floor(Math.random() * 50) + 30;      // 30 ~ 80%
            let soil = Math.floor(Math.random() * 60) + 20;          // 20 ~ 80%

            // 10% 확률로 이상치 발생 (온도)
            if (Math.random() < 0.1) {
                temperature = temperature < 10 ? temperature - 10 : temperature + 10;
            }
            // 10% 확률로 이상치 발생 (습도)
            if (Math.random() < 0.1) {
                humidity = humidity < 40 ? humidity - 20 : humidity + 20;
            }
            // 10% 확률로 이상치 발생 (토양습도)
            if (Math.random() < 0.1) {
                soil = soil < 40 ? soil - 20 : soil + 20;
            }

            const newDataPoint = {
                time: `${timeRef.current}`,
                temperature,
                humidity,
                soil,
            };

            // 새로운 데이터 추가 후 50개를 초과하면 가장 오래된 데이터 제거
            setData((prevData) => {
                const updatedData = [...prevData, newDataPoint];
                if (updatedData.length > 50) {
                    updatedData.shift();
                }
                return updatedData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // 온도 도트 커스텀 렌더러 (이상치: < 10 또는 > 35)
    const renderTemperatureDot = (props) => {
        const { cx, cy, value } = props;
        const isOutlier = value < 10 || value > 35;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={isOutlier ? 6 : 3}
                fill={isOutlier ? 'red' : 'blue'}
            />
        );
    };

    // 습도 도트 커스텀 렌더러 (이상치: < 30 또는 > 70)
    const renderHumidityDot = (props) => {
        const { cx, cy, value } = props;
        const isOutlier = value < 30 || value > 70;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={isOutlier ? 6 : 3}
                fill={isOutlier ? 'red' : 'green'}
            />
        );
    };

    // 토양습도 도트 커스텀 렌더러 (이상치: < 20 또는 > 80)
    const renderSoilDot = (props) => {
        const { cx, cy, value } = props;
        const isOutlier = value < 20 || value > 80;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={isOutlier ? 6 : 3}
                fill={isOutlier ? 'red' : 'brown'}
            />
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>실시간 센서 데이터 시각화</h1>

            <h2>온도 (°C)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: '시간', position: 'insideBottomRight', offset: 0 }}
                    />
                    <YAxis label={{ value: '온도 (°C)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#8884d8"
                        dot={renderTemperatureDot}
                    />
                </LineChart>
            </ResponsiveContainer>

            <h2>습도 (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: '시간', position: 'insideBottomRight', offset: 0 }}
                    />
                    <YAxis label={{ value: '습도 (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#82ca9d"
                        dot={renderHumidityDot}
                    />
                </LineChart>
            </ResponsiveContainer>

            <h2>토양습도 (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: '시간', position: 'insideBottomRight', offset: 0 }}
                    />
                    <YAxis label={{ value: '토양습도 (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="soil"
                        stroke="#ffc658"
                        dot={renderSoilDot}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default App;
