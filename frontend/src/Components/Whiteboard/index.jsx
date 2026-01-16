import rough from "roughjs";
import { useEffect, useLayoutEffect, useState } from "react";

const roughGenerator = rough.generator();

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool
}) => {

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 150;
    }, []);

    useLayoutEffect(() => {
        const roughCanvas = rough.canvas(canvasRef.current);

        if(elements.length > 0) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element) => {
            if (element.type === "pencil") {
                roughCanvas.linearPath(element.path);
            }
            else if (element.type === "line") {
                roughCanvas.draw(roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height));
            }
            else if (element.type === "rect") {
                roughCanvas.draw(roughGenerator.rectangle(element.offsetX, element.offsetY, element.width - element.offsetX, element.height - element.offsetY));
            }

        });
    }, [elements]);

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "pencil", path: [[offsetX, offsetY]], stroke: "black" }
            ]);
        }
        else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "line", offsetX, offsetY, width: offsetX, height: offsetY, stroke: "black" }
            ]);
        }
        else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                { type: "rect", offsetX, offsetY, width: offsetX, height: offsetY, stroke: "black" }
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
