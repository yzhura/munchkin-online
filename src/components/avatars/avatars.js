import React, { useState, useEffect } from 'react';
import imagesPathsArr from '../../helpers/imagesPath'

function AvatarConstructor (checked, src, id) {
    this.checked = checked;
    this.src = src;
    this.id = id;
}

const Avatars = ({chooseAvatar, googlePhoto}) => {

    const avatars = [];
    avatars.push(new AvatarConstructor(false, googlePhoto, 0));

    for(let i = 0; i < imagesPathsArr.length; i++) {
        avatars.push(new AvatarConstructor(false, imagesPathsArr[i], i + 1))
    }

    const [avatarsArr, setAvatars] = useState(avatars);

    const toggleChecked = (avatarId, avatarSrc) => {
        const newAvatars = [...avatarsArr];

        newAvatars.forEach((el) => {
            el.checked = false
            if(el.id === avatarId) {
                el.checked = !el.checked;
                chooseAvatar(el.src);
            }
        })
      
        setAvatars(newAvatars)
    }

    return (
         <ul className="avatars-list d-flex flex-wrap">
            {
            avatarsArr.map((avatar, i) => (
                <li key={i} className={`${avatar.checked ? 'checked' : ''}`}>
                    <div className='avatars-list-item avatar-holder' onClick={() => toggleChecked(avatar.id, avatar.src)}>
                        <img src={avatar.src}/>
                    </div>
                </li>
            ))
            }
        </ul>
    )
}

export default Avatars