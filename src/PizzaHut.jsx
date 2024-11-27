import React, { useState, useEffect } from 'react';
import SubmitCheck from './SubmitCheck'; // 导入弹窗组件

const PizzaHut = ({ data }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [reviewedIds, setReviewedIds] = useState(data.filter(item => item.is_shortlist).map(item => item.id)); // 初始审核状态
    const [showPopup, setShowPopup] = useState(false); // 控制弹窗显示

    useEffect(() => {
        // 设置初始审核状态
        const initialReviewedIds = data.filter(item => item.is_shortlist).map(item => item.id);
        setReviewedIds(initialReviewedIds);
    }, [data]);

    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            alert('請至少選擇一個列表資訊後再操作');
            return;
        }

        const token = localStorage.getItem('accessToken'); // 从localStorage获取token
        if (!token) {
            console.error('No token found');
            return;
        }

        // 创建请求体，直接包含 ID 的数组
        const body = JSON.stringify(selectedIds);

        try {
            const response = await fetch('http://123.194.1.137:18080/api/v1/admin/submit_p', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Submit result:', result);

                // 更新已审核的 ID 列表
                setReviewedIds((prevReviewedIds) => [...prevReviewedIds, ...selectedIds]);

                // 清空已选择的 ID
                setSelectedIds([]);

                // 关闭弹窗
                setShowPopup(false);
            } else {
                const errorResult = await response.json();
                console.error('Error submitting data:', errorResult.msg);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const openPopup = () => {
        if (selectedIds.length === 0) {
            alert('請至少選擇一個列表資訊後再操作');
            return;
        }
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <div className='content_header'>
                <span className='t32'>必勝客名單審核</span>
                <button className='btn-style2 t18' onClick={openPopup}>審核完成</button>
            </div>
            <div className='content_main'>
                <div className="list_header">
                    <span>照片</span>
                    <span>ID</span>
                    <span>狀態</span>
                </div>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>
                            {!reviewedIds.includes(item.id) ? (
                                <input
                                    type="checkbox"
                                    id={`item${item.id}`}
                                    name={`item${item.id}`}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    checked={selectedIds.includes(item.id)}
                                />
                            ) : (
                                <div className="empty-space"></div> // 替代隐藏复选框的空白 div
                            )}
                            <label htmlFor={`item${item.id}`}>
                                <img src={item.photo} alt="" />
                            </label>
                            <span className='t18'>{item.id}</span>
                            <section>
                            <span className={`t18 ${reviewedIds.includes(item.id) ? 'reviewed' : 'not-reviewed'}`}>
                                {reviewedIds.includes(item.id) ? '已審核' : '未審核'}
                            </span>
                            </section>
                            
                        </li>
                    ))}
                </ul>
            </div>
            {showPopup && (
                <SubmitCheck 
                    onClose={closePopup} 
                    onConfirm={handleSubmit} 
                />
            )}
        </div>
    );
};

export default PizzaHut;
