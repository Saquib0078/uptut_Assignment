


import React,{useState,useEffect,useRef} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
function Chat({socket,username,room}) {
const[currentMessage,setCurrentMessage]=useState("");
const[messageList,setMessagList]=useState([])
const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileInputChange = e => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      const fileData = {
        room: room,
        author: username,
        file: file,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send-file', fileData);
      setFile(null);
    }
  };
const sendMessage= async ()=>{
    if(currentMessage !==""){
        const messageData={
            room:room,
            author:username,
            message:currentMessage,
            time:new Date(Date.now()).getHours()+
            ":"+new Date(Date.now()).getMinutes(),
        }
       await socket.emit("send-message",messageData)
       setMessagList((list)=>[...list,messageData])
       setCurrentMessage("")
    }
}
useEffect(()=>{
    socket.on("revieve-message",(data)=>{
        setMessagList((list)=>[...list,data])
    
    })
    socket.on('receive-file', data => {
        setMessagList(list => [...list, data]);
      });
    return () => {
        socket.off("revieve-message");
        socket.off('receive-file');

      };
},[socket])

  return (
    <div className='chat-window'>
<div className='chat-header'>
    <p>Live Chat</p>
</div>
<div className='chat-body'>
    <ScrollToBottom className='message-container'>
{messageList.map((messageContent,index)=>{
    return (
        <div key={index} className='message' id={username===messageContent.author?"you":"other"}>
        <div >
        <div className='message-content'>
            <p>{messageContent.message}</p>
            </div>    
        <div className='message-meta'>
            <p id='time'>{messageContent.time}</p>
            <p id='author'>{messageContent.author}</p>

            </div>    


            </div>    

        </div>
    )
})}
</ScrollToBottom>
</div>
<div className='chat-footer'>
    <input type="text"  
    value={currentMessage}
    placeholder='write message'
    onChange={(event)=>{
      setCurrentMessage(event.target.value)
     }}
     onKeyPress={(event)=>{event.key==="Enter" && sendMessage()}}
     />
    <button onClick={sendMessage}>&#9658;</button>
</div>
<div>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} />
          <button onClick={handleFileUpload}>Upload File</button>
        </div>
      </div>

  )
}

export default Chat
