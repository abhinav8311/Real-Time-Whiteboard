import './App.css'
import Forms from './Components/Forms';
import {Routes , Route} from "react-router-dom"
import RoomPage from './Pages/RoomPage';

function App() {
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<Forms />}/>
        <Route path='/:roomId' element={<RoomPage />}/>
      </Routes>
    </div>
  )
}

export default App;
