import React, { useContext, useState, useEffect } from 'react';
import Modal from '../modal';
import { GameContext } from '../app';
import { Link, withRouter  } from 'react-router-dom';
import Avatars from '../avatars';
import { writeUserData } from '../../firebase/firebase'

const Profile = () => {

    const { user } = useContext(GameContext);
    let { nickname, avatar, photoURL } = user;

    const [newPhoto, setNewPhoto] = useState(avatar);
    const [newNickname, setNewNickname] = useState(nickname);
    const [resultText, setResultText] = useState('');
    const [disableBtn, setDisableBtn] = useState(false)
    let [modal, setModal] = useState(false);
   
    const chooseAvatar = (src) => {
        setResultText('');
        setNewPhoto(src)
    }

    const onChangeNickname = (event) => {
        setResultText('');
        let length = event.target.value.length;
        if (length === 0 || length > 30) {
            event.target.classList.add("is-invalid");
            event.target.classList.remove("is-valid");
            setDisableBtn(true);
        } else {
            event.target.classList.remove("is-invalid");
            event.target.classList.add("is-valid");
            setNewNickname(event.target.value);
            setDisableBtn(false);
        }
    }

    const saveData = () => {
        let updatedUser = Object.assign(user);
        updatedUser.nickname = newNickname;
        updatedUser.avatar = newPhoto;
        writeUserData(updatedUser).then(data => {
            setResultText(data);
        })
    }

    return (
        <React.Fragment>
            <div className="profile-wrap">
                <Link to={'/'} className="icon-return"></Link>
                <h1 className='text-center'>Профиль</h1>
                <div className='avatar-holder'>
                    <img src={newPhoto} alt='avatar'/>
                </div>
                <button onClick={() => setModal(modal => !modal)} className='btn btn-info d-flex align-items-center mt-2 mr-auto ml-auto mb-3'>Изменить аватар <i className='icon-edit ml-2'></i> </button>
                <div className="form-group">
                    <label className="form-control-label" htmlFor="nickname">Никнейм:</label>
                    <input className="form-control" id="nickname" defaultValue={nickname} onChange={onChangeNickname}/>
                </div>
                {resultText ? <p className='text-success'>{resultText}</p> : null}
                <button type="button" className="btn btn-success" onClick={saveData} disabled={disableBtn}>Сохранить</button>
            </div>
            <Modal title="Изменить аватар" show={modal} setModal={setModal} disableSave={true}>
                <Avatars chooseAvatar={chooseAvatar} googlePhoto={photoURL}/>
            </Modal>
        </React.Fragment>
    )
}

export default withRouter(Profile);