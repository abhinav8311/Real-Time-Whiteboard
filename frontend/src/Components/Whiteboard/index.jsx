import rough from "roughjs";
import { useEffect, useLayoutEffect, useState } from "react";

const roughGenerator = rough.generator();

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    color,
    user,
    socket
}) => {
    const [img, setImg] = useState(null);

    useEffect(() => {
        socket.on("WhiteBoardDataResponse", (data) => {
            setImg(data.imgURL);
        });
    }, []);


    if (!user?.presenter) {
        return (
            <div
                className="canvas-box border border-dark border-3">
                <img src={img} alt="Real time white board image shared by presenter"
                    style={{
                        height:window.innerHeight,
                        width :"150%"
                    }} />
            </div>
        )
    }

    const [isDrawing, setIsDrawing] = useState(false);
    

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 150;

        ctx.strokeStyle = color
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, []);

    useEffect(() => {
        const ctx = ctxRef.current;
        ctx.strokeStyle = color;
    }, [color]);

    useLayoutEffect(() => {
        if(canvasRef){
        const roughCanvas = rough.canvas(canvasRef.current);

        if (elements.length > 0) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element) => {
            if (element.type === "pencil") {
                roughCanvas.linearPath(element.path, { stroke: element.stroke, strokeWidth: 4, roughness: 0 });
            }
            else if (element.type === "line") {
                roughCanvas.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, { stroke: element.stroke, strokeWidth: 4, roughness: 0 }));
            }
            else if (element.type === "rect") {
                roughCanvas.draw(roughGenerator.rectangle(element.offsetX, element.offsetY, element.width - element.offsetX, element.height - element.offsetY, { stroke: element.stroke, strokeWidth: 4, roughness: 0 }));
            }

        });

        const canvasImage = canvasRef.current.toDataURL("image/png");
        socket.emit("whiteboardData", canvasImage);
    }}, [elements]);

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "pencil", path: [[offsetX, offsetY]], stroke: color }
            ]);
        }
        else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "line", offsetX, offsetY, width: offsetX, height: offsetY, stroke: color }
            ]);
        }
        else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "rect", offsetX, offsetY, width: offsetX, height: offsetY, stroke: color }
            ]);
        }

        setIsDrawing(true);
    }

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (isDrawing) {
            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === prevElements.length - 1) {
                            return { ...ele, path: newPath };
                        }
                        else {
                            return ele;
                        }
                    })
                )
            }
            else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === prevElements.length - 1) {
                            return { ...ele, width: offsetX, height: offsetY };
                        }
                        else {
                            return ele;
                        }
                    })
                )
            }
            else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === prevElements.length - 1) {
                            return { ...ele, width: offsetX, height: offsetY };
                        }
                        else {
                            return ele;
                        }
                    })
                )
            }
        }
    }

    const handleMouseUp = (e) => {
        setIsDrawing(false);
    }

    

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="canvas-box border border-dark border-3">
            <canvas
                ref={canvasRef}>
            </canvas>
        </div>
    )
}

export default WhiteBoard;
