import React, { useState, useContext, useEffect} from 'react';
import useLobby from "../hooks/useLobby";
import {Link, Redirect, withRouter} from 'react-router-dom';
import { GameContext } from '../app';
import Loading from '../loading';
import UserCard from '../user-card'
import Dice from "../dice";
import  { msToTime } from '../../helpers/helperFunctions';

const Lobby = (props) => {

    const { user } = useContext(GameContext);
    const { roomId } = props.match.params; // Gets roomId from URL
    const { messages,
            connections,
            isRoomDeleted,
            timer,
            isRoomClosed,
            cubicNumber,
            cubicAnimation,
            cubicToggleAnimate,
            disconnectedUser,
            sendMessage,
            sendSkills,
            sendInitConnection,
            sendGenerateNumber
           } = useLobby(roomId); // Creates a websocket

    const [newMessage, setNewMessage] = useState(""); // Message to be sent
    const [userLevel, setLevel] = useState(1);
    const [userStrength, setStrength] = useState(0);
    const [timerTime, setTimer] = useState(timer);
    const { uid: userId, nickname, avatar } = user;
    const disabledLevelDown = userLevel < 2;
    const disabledStrengthDown = userStrength === 0;
    
    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        sendMessage(newMessage, nickname);
        setNewMessage("");
    }

    const generateNumber = () => {
        sendGenerateNumber();
    }

    const handleSkills = (action) => {
        switch(action) {
            case 'levelUp':
                setLevel((userLevel) => userLevel + 1);
                break;
            case 'levelDown':
                setLevel((userLevel) => userLevel - 1);
                break;
            case 'strengthUp':
                setStrength((userStrength) => userStrength + 1);
                break;
            case 'strengthDown':
                setStrength((userStrength) => userStrength - 1);
                break;
            default:
                return false
        }
    }

    useEffect(() => {
        sendInitConnection({...user, userLevel, userStrength,});
        return () => {
            console.log("Unmount");
        }
    }, [])


    useEffect(() => {
        sendSkills({userLevel, userStrength, userId});
    }, [userLevel, userStrength])


    useEffect(() => {
        setTimer(timer);

        let inervalId

        if(timer) {
            inervalId = setInterval(() => {
                setTimer(timerTime => timerTime - 1000);
            }, 1000);
        }

        return () => {
            clearInterval(inervalId);
        }
    }, [timer, connections])

    if (isRoomClosed && userId === disconnectedUser) {
        return (
          <Redirect to={{
              pathname: '/error',
              state: {
                  title: 'Ошибка',
                  body: 'Эта комната уже заполнена, максимум 10 игроков',
                  redirectToLink: '/',
                  redirectToText: 'Вернуться назад!'
              }
          }} />
        )
    }

    if (connections.length === 0) {
        return (
            <Loading/>
        )
    }

    if (isRoomDeleted) {
        return <Redirect to="/"/>
    }

    const anotherConnectedUsers = connections.filter((player) => {
        return player.id !== user.uid
    })

    let winner = connections.find((el) => {
        return el.level === 10;
    })

    return (
        <div className='lobby-wrap w-100 text-center'>
            <h1 className='mt-0 mb-2'>Комната: {roomId}</h1>
            <p>Эта комната удалится через: {msToTime(timerTime)}</p>
            {
                winner
                  ?
                  <div className="alert alert-dismissible alert-success">
                      Воу! <br/>
                      Победил: {winner.name}
                  </div>
                  :
                  null
            }
            <div className="header m-auto position-relative">
              <UserCard
                nickname={nickname}
                photoURL={avatar}
                userLevel={userLevel}
                disabledLevelDown={disabledLevelDown}
                userStrength={userStrength}
                disabledStrengthDown={disabledStrengthDown}
                handleSkills={handleSkills}/>
              <div className="cubic-wrap">
                <button className="cubic-btn" onClick={generateNumber} disabled={cubicAnimation}>
                  <Dice number={cubicNumber} toggle={cubicToggleAnimate}></Dice>
                </button>
              </div>
            </div>
            <div className="row">
                {
                    anotherConnectedUsers.map((user, i) => (
                        <div className="col-6" key={i}>
                            <UserCard 
                                nickname={user.name}
                                photoURL={user.photo}
                                userLevel={user.level}
                                userStrength={user.strength}/>
                        </div>
                    ))
                }

            </div>
            <div className="area-wrap">
                <div className="messages-container">
                    <ul className="messages-list">
                        {
                            messages.map((message, i) => (
                                <li
                                    key={i}
                                    className={`message-item ${
                                        message.ownedByCurrentUser 
                                        ? 
                                            "my-message" 
                                        :
                                            "received-message"}`}
                                >
                                    <span>{message.user}:</span><br/>
                                    {message.body}
                                </li>
                            ))
                        }
                    </ul>
                </div>
              <div className="textarea-wrap position-relative w-100">
                <textarea
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Write message..."
                    className="new-message-input"/>
                <button onClick={handleSendMessage} className="send-message-button">
                    <i className='icon-send'></i>
                </button>
              </div>
            </div>
        </div>
    )
}

export default withRouter(Lobby);