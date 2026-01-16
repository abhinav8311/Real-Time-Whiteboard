import "./index.css";
import { useRef, useState } from "react";
import WhiteBoard from "../../Components/Whiteboard";

const RoomPage = () => {

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#000000");
    const [elements, setElements] = useState([]);
    return ( 
        <div className="row">      
            <h1 className="text-center py-4">
                White Board Sharing App <span className="text-primary">[Users Online:0]</span>
            </h1>
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
                        <button className="btn btn-primary">Undo</button>
                        <button className="btn btn-outline-primary">Redo</button>
                        <button className="btn btn-danger">Clear Board</button>
                    </div>
                </div>
            </div>
            <div className="col-md-10 border mx-auto mt-4 canvas-box">
                <WhiteBoard canvasRef={canvasRef} ctxRef={ctxRef} elements={elements} setElements={setElements} 
                            tool={tool}/>
            </div>
        </div>
    )
}

export default RoomPage;