import React, { useState, useEffect } from 'react';
import firebase, { authProvider, writeUserData, getUserData } from '../../firebase/firebase';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import Home from "../home";
import Lobby from "../lobby";
import SignIn from '../signin'
import Profile from '../profile';
import Loading from '../loading';
import Error from "../error";
import { getRandomPath } from '../../helpers/imagesPath';
import ErrorBoundary from "../error-boundary";

const GameContext = React.createContext('');

const App = () => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);

  const googleLogin = () => {
    firebase.auth()
      .signInWithPopup(authProvider)
      .then((result) => {

        /** @type {firebase.auth.OAuthCredential} */
        let credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = credential.accessToken;
        // The signed-in user info.

      }).catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        console.log('errorCode:' , errorCode);
        console.log('errorMessage:' , errorMessage)
        console.log('email:' , email)
        console.log('credential:' , credential)
      });
  }

  const anonymousLogin = () => {
    firebase.auth().signInAnonymously()
            .then((data) => {
              setLogin(true)
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
    }); 
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setLoading(true);
      if (user) {

        if(user.isAnonymous) {
          const randomName = uniqueNamesGenerator({ dictionaries: [names] });
          const {uid} = user;
          let avatar = getRandomPath;
          setUser( {
            photoURL: avatar,
            avatar: avatar,
            uid,
            nickname: randomName,
            isAnonymous: true
          });
          setLoading(false);
          return
        }

        const {uid, displayName, email, photoURL} = user;
        let nickname = displayName;
        let avatar = photoURL;

        getUserData().then((data) => {
          if(data) {
            setUser(data);
            setLoading(false);
          } else {
            writeUserData({uid, displayName, email, photoURL, avatar, nickname})
              .then((data) => {
                if(data !== 'error') {
                  setUser({uid, displayName, email, photoURL, avatar, nickname})
                  setLogin(true)
                  setLoading(false)
                }
              });
          }
        })
      } else {
        setUser(null);
        setLoading(false);
        setLogin(false)
      }
    })

  }, [login]);


  if (loading) {
    return (
      <Loading/>
    )
  }

  if (!user) {
    return (
      <>
        <h1 className="m-b-5 m-t-5 text-center logo">Munchkin</h1>
        <SignIn googleLogin={googleLogin} anonymousLogin={anonymousLogin}/>
      </>
    )
  }

  return (
    <GameContext.Provider value={{user, googleLogin, anonymousLogin}}>
      <Router>
        <h1 className="m-b-5 m-t-5 text-center logo">Munchkin</h1>
        <div className="container">
            <Switch>
                <Route exact path="/profile/" component={Profile} />
                <Route exact path="/lobby/:roomId/" component={Lobby} />
                <Route exact path="/error" render={(props) => <Error {...props}/>}/>
                <Route exact path="/" component={Home} />
                <Redirect to="/"/>
            </Switch>
        </div>
      </Router>
    </GameContext.Provider>
  );
}


export { GameContext }

export default App;