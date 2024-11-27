import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/styles.scss';
import showIcon from './assets/ic_psw_show.svg';
import hideIcon from './assets/ic_psw_hide.svg';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isUsernameError, setIsUsernameError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const navigate = useNavigate();

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 重置错误消息
        setIsUsernameError(false);
        setIsPasswordError(false);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('http://123.194.1.137:18080/api/v1/admin/login', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 400) {
                setError('帳號密碼輸入錯誤請重新嘗試');
                setIsUsernameError(true);
                setIsPasswordError(true);
            } else if (response.ok) {
                const data = await response.json();
                console.log('API 响应数据:', data); // 确保正确获取到数据
                const accessToken = data.data.token; // 获取到 token
                localStorage.setItem('accessToken', accessToken);
                console.log('Access Token Stored:', accessToken);

                alert(data.msg); 
                navigate('/stage'); // Navigate to the Stage page
            } else {
                throw new Error('非預期的錯誤');
            }
        } catch (error) {
            setError('登入過程中發生錯誤，請稍後再試');
        }
    };

    return (
        <div className="popup-login">
            <div className="popup" onClick={e => e.stopPropagation()}>
                <div className='popup_header'>
                    <span className='t30'>登入</span>
                </div>
                <div className='popup_context'>輸入帳號密碼來登入後台管理</div>

                <form onSubmit={handleSubmit}>
                    <label className='input_title t14' htmlFor="username">用戶名</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className={`input_style ${isUsernameError ? 'input-error' : ''}`}
                        placeholder='請輸入用戶名'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <label className='input_title t14' htmlFor="password">密碼</label>
                    <div className="password-input-wrapper">
                        <div className={`input_style-psw ${isPasswordError ? 'input-error' : ''}`}>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder='請輸入密碼'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <img
                                src={passwordVisible ? hideIcon : showIcon}
                                alt="Toggle Password Visibility"
                                className="password-toggle-icon"
                                onClick={handlePasswordVisibilityToggle}
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button className='btn-style3 t18' type="submit">登入</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
