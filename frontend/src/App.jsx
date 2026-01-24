import './App.css'
import Forms from './Components/Forms';
import {Routes , Route} from "react-router-dom"
import RoomPage from './Pages/RoomPage';
import { useState , useEffect} from 'react';
import io from "socket.io-client";

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection" : true,
  reconnectionAttempts:"Infinity",
  timeout:10000,
  transports:["websocket"]
};

const socket = io(server,connectionOptions);

function App() {

  const [user,setUser] = useState(null);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if(data.success){
        console.log("User successfully joined the room");
      }else{
        console.log("Error joining the room");
      }
  })
}, []);

  const uuid=() => {
    let S4 = () =>{
      return (((1+Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return(
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4() 
    );
  };

  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>}/>
        <Route path='/:roomId' element={<RoomPage />}/>
      </Routes>
    </div>
  )
}

export default App;
