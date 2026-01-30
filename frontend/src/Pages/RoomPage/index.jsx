import "./index.css";
import { useRef, useState } from "react";
import WhiteBoard from "../../Components/Whiteboard";

const RoomPage = ({user,socket, users}) => {

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#000000");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openUserTab, setOpenUserTab] = useState(false);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setElements([]);
    }

    const undo = () => {
        setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
        setElements((prevElements) => prevElements.slice(0, prevElements.length - 1));
    } 
    
    const redo = () => {
        setElements((prevElements) => [...prevElements, history[history.length - 1]]);
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    }
    return ( 
        <div className="row">  
            <button className="btn btn-dark"
            style={{
                display:"block",
                position:"absolute",
                top:"5%",
                left:"5%",
                height:"40px",
                width:"100px"
            }} onClick={() => setOpenUserTab(true)}>
                Users
            </button> 
            {openUserTab && (
                <div className="position-fixed top-0 h-100 text-white bg-dark"
                style={{width:"250px" , left:"0%"}}> 
                <button type="button" className="btn btn-light btn-block w-100 mt-5" onClick={() => setOpenUserTab(false)}>
                    Close
                </button>
                <div className="w-100 mt-5 pt-5">
                {users.map((usr,index) => (
                    <p key={index* 999} className="my-2 text-center w-100">
                        {usr.name}{user && usr.userId === user.userId ? " (You)" : ""}
                    </p>
                ))}
                </div>
                </div>
            )}
            <h1 className="text-center py-4">
                White Board Sharing App <span className="text-primary">[Users Online:{users.length}]</span>
            </h1>
            {
                user && user.presenter && (
                    <div className="col-md-12 mx-auto px-5 mb-5">
                <div className="d-flex flex-wrap align-items-center justify-content-center gap-4">
                    {/* Drawing Tools */}
                    <div className="d-flex gap-3 align-items-center">
                        <div className="d-flex gap-2 align-items-center">
                            <label htmlFor="pencil">Pencil</label>
                            <input type="radio" name="tool" id="pencil" checked={tool === "pencil"} value="pencil" className="mt-1" onChange={(e) => setTool(e.target.value)} />
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <label htmlFor="line">Line</label>
                            <input type="radio" name="tool" id="line" checked={tool === "line"} value="line" className="mt-1" onChange={(e) => setTool(e.target.value)} />
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <label htmlFor="rect">Rectangle</label>
                            <input type="radio" name="tool" id="rect" checked={tool === "rect"} value="rect" className="mt-1" onChange={(e) => setTool(e.target.value)} />
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="color">Color:</label>
                        <input type="color" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-primary" disabled={elements.length === 0} onClick={() => undo()}>Undo</button>
                        <button className="btn btn-outline-primary" disabled={history.length < 1} onClick={() => redo()}>Redo</button>
                        <button className="btn btn-danger" onClick={handleClearCanvas}>Clear Board</button>
                    </div>
                </div>
            </div>
                )
            }
            
            <div className="col-md-10 border mx-auto mt-4 canvas-box">
                <WhiteBoard canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} 
                            color={color} tool={tool} user={user} socket={socket}/>
            </div>
        </div>
    )
}

export default RoomPage;