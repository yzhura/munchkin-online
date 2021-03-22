import React from 'react';
import './user-card.scss';

const UserCard = (props) => {

    const {
        nickname,
        photoURL,
        userLevel,
        disabledLevelDown,
        userStrength,
        disabledStrengthDown,
        handleSkills,
    } = props;

    if(!handleSkills) {
        return (
            <div className="user-card">
                <div className="user-avatar-card">
                    <p className="nickname">{nickname}</p>
                    <div className="user-sum-skills">Общий: <span>{userStrength + userLevel}</span></div>
                    <img src={photoURL} alt="" className="avatar"/>
                    <div className="user-info">
                        <div className="user-level">Уровень: <span>{userLevel}</span></div>
                        <div className="user-strength">Сила: <span>{userStrength}</span></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="user-card user-main">
            <div className="user-avatar-card">
                <p className="nickname">{nickname}</p>
                <div className="user-sum-skills">Общий: <span>{userStrength + userLevel}</span></div>
                <img src={photoURL} alt="" className="avatar"/>
                <div className="user-info">
                    <div className="user-skills user-level">
                        <button
                          className='btn btn-outline-danger'
                          onClick={() => handleSkills('levelDown')}
                          disabled={disabledLevelDown}
                        >-</button>
                        <p className="user-skill-text">Уровень: <span>{userLevel}</span></p>
                        <button
                          className='btn btn-outline-success'
                          onClick={() => handleSkills('levelUp')}
                        >+</button>
                    </div>
                    <div className="user-skills user-strength">
                        <button
                          onClick={() => handleSkills('strengthDown')}
                          disabled={disabledStrengthDown}
                          className='btn btn-outline-danger'
                        >-</button>
                        <p className="user-skill-text">Сила: <span>{userStrength}</span></p>
                        <button
                          onClick={() => handleSkills('strengthUp')}
                          className='btn btn-outline-success'
                        >+</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard
