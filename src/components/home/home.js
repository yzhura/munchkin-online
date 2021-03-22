import React, { useState, useContext } from 'react';
import { Link, withRouter  } from 'react-router-dom';
import { GameContext } from '../app';
import firebase from '../../firebase/firebase';
import roomNames from "../../helpers/roomNames";
import { uniqueNamesGenerator } from 'unique-names-generator';

const Home = ({ history }) => {

    const [roomName, setRoomName] = useState('');
    const { user } = useContext(GameContext);

    const handleRoomNameChange = (event) => {
        if (event.target.value === '') {
            event.target.classList.add("is-invalid");
            event.target.classList.remove("is-valid");
        } else {
            event.target.classList.remove("is-invalid");
            event.target.classList.add("is-valid");
        }
        setRoomName(event.target.value);
    }

    const generateRoomName = () => {
        setRoomName(uniqueNamesGenerator({dictionaries:[roomNames]}))
    }

    const logOut = () => {
        firebase.auth().signOut().then(() => {
            history.push('/signin')
        }).catch((error) => {
          // An error happened.
        });
    }

    return (
        <>
            <div className="home-header d-flex justify-content-between align-items-center">
                {
                    user.isAnonymous
                      ?
                      <div className="profile-avatar ">
                          <img src={user.avatar} alt="user-avatar"/>
                      </div>
                      :
                      <Link to={`/profile/`} className='profile-link d-flex align-items-center'>
                          <div className="profile-avatar ">
                              <img src={user.avatar} alt="user avatar"/>
                          </div>
                          <span className='d-flex align-items-center'><i className='icon-left-arrow mr-2'></i> Профиль</span>
                      </Link>
                }
                <button onClick={logOut} className='btn btn-outline d-flex align-items-center'>Выйти <i className="icon-log-out ml-2"></i></button>
            </div>
            <h1>Привет, {user.nickname || user.displayName }!</h1>
            <p>Придумайте с друзьями одинаковые название комнаты и нажмите "В путь!"</p>
            <div className="form-group">
                <label htmlFor='roomName'>Название комнаты:</label>
                <div className="field d-flex align-items-center">
                    <input type="text"
                            id="roomName"
                            placeholder="Введите название комнаты"
                            value={roomName}
                            onChange={handleRoomNameChange}
                            className="form-control room-name mr-4 w-75"
                    />
                    <Link
                      to={`/lobby/${roomName}`}
                      className={`enter-room-name-button btn btn-primary flex-shrink-0 ${!roomName ? 'disabled' : 'enabled'}`}
                    >
                        В путь!
                    </Link>
                </div>
            </div>
            <button className="btn btn-info mb-5" onClick={generateRoomName}>Рандомное название</button>
        </>
    )
}

export default withRouter(Home)