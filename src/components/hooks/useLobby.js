import { useEffect, useRef, useState, useContext } from "react";
import socketIOClient from "socket.io-client";
import { GameContext } from '../app';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const NEW_SKILLS_EVENT = "newSkillsEvent";
const NEW_ROOM_CONNECTION = "newRoomConnection";
const ROOM_IS_DELETED = "roomIsDeleted";
const USER_DISCONNECT = "userDisconnect";
const GENERATE_CUBIC_NUMBER = "generateNumber";

// const SOCKET_SERVER_URL = "/"; //HEROKU
const SOCKET_SERVER_URL = "localhost:4000"; //Local

const useLobby = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [connections, setConnections] = useState([]);
    const [timer, setTimer] = useState(null);
    const [isRoomDeleted, setRoomDeleted] = useState(false);
    const [isRoomClosed, setRoomClose] = useState(false);
    const [disconnectedUser, setDisconnectedUser] = useState('');
    const [cubicNumber, setCubicNumber] = useState(1);
    const [cubicToggleAnimate, setCubicToggleAnimate] = useState(false);
    const [cubicAnimation, setCubicAnimation] = useState(false);
    const socketRef = useRef();
    const { user } = useContext(GameContext);

    useEffect(() => {

        // Creates a WebSocket connection
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: {roomId},
        });


        socketRef.current.on(NEW_ROOM_CONNECTION, (connections, closed, disconnectUserId) => {
            const { users, roomName, timer: roomTimer, cubic } = connections

            if(roomName !== roomId) {
                return
            }

            if(closed) {
                setRoomClose(closed);
                setDisconnectedUser(disconnectUserId);
            }

            setConnections((connections) => [...users]);
            setTimer(roomTimer);
            setCubicNumber(cubic);
        })

        // Listens for incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id,
            };
            setMessages((messages) => [...messages, incomingMessage]);
        })

        socketRef.current.on(ROOM_IS_DELETED, (info) => {
            setRoomDeleted(info);
            setConnections((connections) => []);
        })

        socketRef.current.on('connect', () => {

        })

        socketRef.current.on('connect', () => {

        })

        socketRef.current.on(GENERATE_CUBIC_NUMBER, (number) => {
            setCubicAnimation(true);
            setCubicNumber(number);
            setCubicToggleAnimate((cubicToggleAnimate) => !cubicToggleAnimate)
            setTimeout(() => {
                setCubicAnimation(false);
            }, 3000)
        })

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            socketRef.current.emit(USER_DISCONNECT, user.uid)
            socketRef.current.disconnect();
        }
    }, [roomId]);

    const sendInitConnection = ({nickname, uid, photoURL, userLevel, userStrength, avatar}) => {
        
        socketRef.current.emit(NEW_ROOM_CONNECTION, {
            name: nickname,
            id: uid,
            level: userLevel,
            strength: userStrength,
            photo: avatar
        });
    }

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendMessage = (messageBody, userName) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,
            user: userName,
            senderId: socketRef.current.id,
        })
    };

    const sendSkills = (userSkills) => {
        socketRef.current.emit(NEW_SKILLS_EVENT, userSkills)
    }

    const sendGenerateNumber = () => {
        socketRef.current.emit(GENERATE_CUBIC_NUMBER)
    }

    return { messages, connections, isRoomDeleted, timer, isRoomClosed, cubicNumber, cubicAnimation, cubicToggleAnimate, disconnectedUser, sendMessage, sendSkills, sendInitConnection, sendGenerateNumber }
}

export default useLobby;