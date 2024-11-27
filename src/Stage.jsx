import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PizzaHut from './PizzaHut';
import KFC from './KFC';

const Stage = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('必勝客');
    const [data, setData] = useState([]); // 用于保存从API获取的数据

    useEffect(() => {
        // 在组件加载时检查管理员状态并获取数据
        checkAdminStatus();
        fetchData(activeItem);
    }, [activeItem]);

    const checkAdminStatus = async () => {
        try {
            // 检查用户状态的逻辑
        } catch (error) {
            console.error('Error fetching admin status:', error);
            navigate('/');
        }
    };

    const fetchData = async (company) => {
        const token = localStorage.getItem('accessToken'); // 从localStorage获取token
        if (!token) {
            navigate('/'); // 如果没有token，导航回首页
            return;
        }

        // 创建FormData对象
        const formData = new FormData();
        formData.append('company', company === '必勝客' ? 'p' : 'k');

        try {
            console.log('Fetching data with URL:', 'http://123.194.1.137:18080/api/v1/admin/list');
            const response = await fetch('http://123.194.1.137:18080/api/v1/admin/list', {
                method: 'POST', // 使用POST请求
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Fetched Data:', result); // 打印获取到的数据

                // 确保将 result.data 作为数组传递
                if (Array.isArray(result.data)) {
                    setData(result.data);
                } else {
                    console.error('Fetched data is not an array:', result.data);
                    setData([]);
                }
            } else {
                const errorResult = await response.json();
                console.error('Error fetching data:', errorResult.msg);
                // navigate('/'); // 如果API返回错误，导航回首页
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // navigate('/'); // 如果发生异常，导航回首页
        }
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // 清除token
        navigate('/'); // 导航回首页
    };

    return (
        <div className='container'>
            <div className='sidebar'>
                <div className='logo'>
                    Pizzahut & KFC<br></br>後台管理系統
                </div>
                <div className='sidebar_pages'>
                    <span
                        className={`t18 ${activeItem === '必勝客' ? 'active' : ''}`}
                        onClick={() => handleItemClick('必勝客')}
                    >
                        必勝客名單審核
                    </span>
                    <span
                        className={`t18 ${activeItem === '肯德基' ? 'active' : ''}`}
                        onClick={() => handleItemClick('肯德基')}
                    >
                        肯德基名單審核
                    </span>
                </div>
                <div className='logout t18' onClick={handleLogout}>
                    登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出
                </div>
            </div>
            <div className='content'>
                {activeItem === '必勝客' ? (
                    <PizzaHut data={data} />
                ) : (
                    <KFC data={data} />
                )}
            </div>
        </div>
    );
};

export default Stage;
