import React from 'react';
import './styles/styles.scss';
import closeIcon from './assets/ic_pop_close.svg';

const SubmitCheck = ({ onClose, onConfirm }) => {
    const handleClose = () => {
        console.log("Close button clicked"); // 添加的 console.log 語句
        onClose();
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup" onClick={e => e.stopPropagation()}>
                <div className='popup_header'>
                    <span className='t30'>確定審核</span>
                    <button className="" onClick={handleClose}>
                        <img src={closeIcon} alt="" />
                    </button>
                </div>
                <div className='popup_status'>
                    <div className='popup_context'>審核完成後將將無法恢復，確定要審核送出嗎？</div>
                </div>
                <div className='btn-group'>
                    <button className='btn-outline t18' onClick={onClose}>取消</button>
                    <button className='btn-style3 t18' onClick={onConfirm}>確定</button>
                </div>
                
            </div>
        </div>
    );
};

export default SubmitCheck;
