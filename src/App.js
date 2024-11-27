import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Stage from './Stage';

const App = () => {
    useEffect(() => {
        // 設定標籤名稱
        document.title = "Pizza&KFC後台";
    
        // 可選：清除效果，在組件卸載時重置標籤名稱
        return () => {
            document.title = "原來的標籤名稱";
        };
      }, []); // 空陣列確保這個effect只在組件初次渲染和卸載時執行一次
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/stage" element={<Stage />} />
            </Routes>
        </Router>
    );
};

export default App;
