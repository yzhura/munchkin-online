import React from 'react';


const SignIn = ({ googleLogin, anonymousLogin }) => {
    
    return (
        <div className="container">
            <div className="text-center mb-5">
                <h1>Привет!</h1>
                <button type="button" className="btn btn-primary mb-3 d-inline-flex align-items-center" onClick={googleLogin}><i className='icon-google mr-2'></i> Войти через Google</button>
                <p>После входа в приложение через Google, ты сможешь сменить никнейм и аватар</p>
                <p>или</p>
                <button type="button" className="btn btn-secondary mb-3 d-inline-flex align-items-center" onClick={anonymousLogin}><i className='icon-anonymous mr-2'></i>Войти как гость*</button>
                <p>*Будет присвоен рандомный никнейм и аватар</p>
            </div>
        </div>
    )
}

export default SignIn;