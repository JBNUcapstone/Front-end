import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SensorChartApp from './sensorData';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<SensorChartApp />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
