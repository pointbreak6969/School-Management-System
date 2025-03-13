// components/PDFViewer/PDFRenderer.jsx
import { useState, useRef, useEffect } from 'react';

export default function PDFRenderer({ 
  pdfDocument, 
  currentPage, 
  scale, 
  isSelectionMode,
  selection,
  setSelection,
  savedSelections
}) {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Render the current PDF page
  const renderPage = async () => {
    if (!pdfDocument || !canvasRef.current) return;

    try {
      const page = await pdfDocument.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Update canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      setCanvasSize({ width: viewport.width, height: viewport.height });
      
      const renderContext = {
        canvasContext: context,
        viewport
      };
      
      await page.render(renderContext).promise;
      
      // Initialize overlay canvas with the same dimensions
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = viewport.width;
        overlayCanvasRef.current.height = viewport.height;
        drawAllSelections();
      }
    } catch (error) {
      console.error('Error rendering PDF page:', error);
    }
  };

  // Effect to render page when PDF document, page, or scale changes
  useEffect(() => {
    if (pdfDocument) {
      renderPage();
    }
  }, [pdfDocument, currentPage, scale]);

  // Effect to update selections when they change
  useEffect(() => {
    if (overlayCanvasRef.current) {
      drawAllSelections();
    }
  }, [selection, savedSelections]);

  // Draw all selections (current and saved) on the overlay canvas
  const drawAllSelections = () => {
    if (!overlayCanvasRef.current) return;
    
    const canvas = overlayCanvasRef.current;
    const context = canvas.getContext('2d');
    
    // Clear the overlay canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw saved selections for this page
    const pageSelections = savedSelections?.filter(s => s.page === currentPage) || [];
    pageSelections.forEach(rect => {
      drawRectangle(context, rect.x, rect.y, rect.width, rect.height, 'blue');
    });
    
    // Draw current selection if it exists
    if (selection) {
      drawRectangle(context, selection.x, selection.y, selection.width, selection.height, 'red');
    }
    
    // Draw rectangle being created
    if (isDrawing) {
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      
      drawRectangle(
        context, 
        Math.min(startPos.x, endPos.x), 
        Math.min(startPos.y, endPos.y), 
        Math.abs(width), 
        Math.abs(height),
        'red'
      );
    }
  };

  // Draw rectangle utility function
  const drawRectangle = (context, x, y, width, height, color = 'red') => {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
    
    // Semi-transparent fill
    context.fillStyle = `${color === 'red' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.1)'}`;
    context.fillRect(x, y, width, height);
  };

  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = (event) => {
    if (!overlayCanvasRef.current) return { x: 0, y: 0 };
    
    const canvas = overlayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate position relative to the canvas with proper scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    return { 
      x: Math.round(x), 
      y: Math.round(y) 
    };
  };

  // Handle mouse cursor position
  const handleMouseMove = (event) => {
    const coords = getCanvasCoordinates(event);
    setMousePosition(coords);
    
    if (isDrawing && isSelectionMode) {
      setEndPos(coords);
      drawAllSelections();
    }
  };
  
  // Handle mouse down event - start drawing
  const handleMouseDown = (event) => {
    if (!isSelectionMode) return;
    
    const coords = getCanvasCoordinates(event);
    setIsDrawing(true);
    setStartPos(coords);
    setEndPos(coords);
  };
  
  // Handle mouse up event - finish drawing
  const handleMouseUp = () => {
    if (isDrawing && isSelectionMode) {
      setIsDrawing(false);
      
      // Calculate the rectangle properties
      const width = Math.abs(endPos.x - startPos.x);
      const height = Math.abs(endPos.y - startPos.y);
      
      if (width > 5 && height > 5) {
        const newSelection = {
          x: Math.min(startPos.x, endPos.x),
          y: Math.min(startPos.y, endPos.y),
          width,
          height,
          page: currentPage
        };
        
        setSelection(newSelection);
      }
    }
  };

  return (
    <div className="relative border border-gray-300">
      {/* Base canvas for PDF rendering */}
      <canvas ref={canvasRef} />
      
      {/* Overlay canvas for selections */}
      <canvas 
        ref={overlayCanvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`absolute top-0 left-0 ${isSelectionMode ? "cursor-crosshair" : "cursor-default"}`}
        style={{ 
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: isSelectionMode ? 'auto' : 'none' 
        }}
      />
      
      <div className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 m-2 border border-gray-300 rounded text-sm">
        X: {mousePosition.x}, Y: {mousePosition.y}
      </div>
      
      {isSelectionMode && !selection && !isDrawing && (
        <div className="absolute top-0 left-0 bg-white bg-opacity-75 p-2 m-2 border border-gray-300 rounded text-sm">
          Click and drag to draw a rectangle
        </div>
      )}
    </div>
  );
}