
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatPage from './Components/Chat';
import './App.css';

const socket = io.connect('http://localhost:3000');

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat,setShowChat]=useState(false)
  const joinRoom=()=>{
    if(username!==""&& room !=="")
    socket.emit('join-room',room)
    setShowChat(true)
  }


  return (
    <div className='App'>
      {!showChat?(
      <div className='joinChatContainer'>
     <h3>Join A Chat</h3>
     <input
     type="text"
     placeholder='saquib'
     onChange={(event)=>{
      setUsername(event.target.value)
     }}
     />
      <input
     type="text"
     placeholder='RoomId'
     onChange={(event)=>{
      setRoom(event.target.value)
     }}
     />
     <button onClick={joinRoom}>Join Room</button>
    </div>
      ):(

    <ChatPage socket={socket} username={username} room={room}/>
      )}
    </div>
  );
}

export default App;
