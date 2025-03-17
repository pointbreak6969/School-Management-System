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
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Fixed rectangle size
  const RECT_WIDTH = 200;
  const RECT_HEIGHT = 90;
  
  // State to track if the rectangle is being dragged
  const [isDragging, setIsDragging] = useState(false);
  const [rectPosition, setRectPosition] = useState(null);

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
  }, [selection, savedSelections, rectPosition]);

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
    
    // Draw the draggable rectangle at the mouse position in selection mode
    if (isSelectionMode && rectPosition) {
      drawRectangle(
        context, 
        rectPosition.x, 
        rectPosition.y, 
        RECT_WIDTH, 
        RECT_HEIGHT,
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
    
    if (isSelectionMode) {
      if (isDragging) {
        // Update the rectangle position while dragging
        setRectPosition({
          x: coords.x - (RECT_WIDTH / 2),
          y: coords.y - (RECT_HEIGHT / 2)
        });
      } else if (!selection) {
        // Preview the rectangle position when hovering
        setRectPosition({
          x: coords.x - (RECT_WIDTH / 2),
          y: coords.y - (RECT_HEIGHT / 2)
        });
      }
      drawAllSelections();
    }
  };
  
  // Handle mouse down event - start dragging
  const handleMouseDown = (event) => {
    if (!isSelectionMode) return;
    
    const coords = getCanvasCoordinates(event);
    setIsDragging(true);
    
    // Center the rectangle at the click position
    setRectPosition({
      x: coords.x - (RECT_WIDTH / 2),
      y: coords.y - (RECT_HEIGHT / 2)
    });
  };
  
  // Handle mouse up event - finish placing the rectangle
  const handleMouseUp = () => {
    if (isDragging && isSelectionMode) {
      setIsDragging(false);
      
      // Create selection with the fixed-size rectangle
      if (rectPosition) {
        const newSelection = {
          x: rectPosition.x,
          y: rectPosition.y,
          width: RECT_WIDTH,
          height: RECT_HEIGHT
        };
        
        setSelection(newSelection);
        setRectPosition(null); // Clear the preview
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
      
      {isSelectionMode && !selection && (
        <div className="absolute top-0 left-0 bg-white bg-opacity-75 p-2 m-2 border border-gray-300 rounded text-sm">
          Click to place a 300×150 signature field
        </div>
      )}
    </div>
  );
}