import { LinearProgress } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";

const DvwViewer = ({ loadProgress, isInvert, rotateValue, patient = {}, brightness, activeFile, dwvApp, selectedTool, onChangeTool, activeSidebar }) => {
  // State for previous tool (to restore when Ctrl is released)
  const [previousTool, setPreviousTool] = useState(null);
  const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);
  // State for tracking image dimensions and cursor position
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const viewerRef = useRef(null);
  
  // Handle Ctrl key press for pan tool activation
  useEffect(() => {
    if (!dwvApp || !onChangeTool) return;
    
    const handleKeyDown = (e) => {
      // Check for Ctrl key (17) or e.ctrlKey
      if ((e.keyCode === 17 || e.key === 'Control' || e.ctrlKey) && !ctrlKeyPressed) {
        // Only switch if we're not already using the pan tool
        if (selectedTool !== "ZoomAndPan") {
          setCtrlKeyPressed(true);
          // Store current tool before switching to pan
          setPreviousTool(selectedTool);
          // Activate pan tool through the parent component's handler
          onChangeTool("ZoomAndPan");
        }
      }
    };
    
    const handleKeyUp = (e) => {
      // Check for Ctrl key release
      if ((e.keyCode === 17 || e.key === 'Control' || e.ctrlKey === false) && ctrlKeyPressed) {
        setCtrlKeyPressed(false);
        // Restore previous tool if it exists
        if (previousTool && previousTool !== "ZoomAndPan") {
          onChangeTool(previousTool);
        }
      }
    };
    
    // Add event listeners to document
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [dwvApp, ctrlKeyPressed, previousTool, selectedTool, onChangeTool]);
  
  useEffect(() => {
    // Only track if we have a valid viewer container
    const layerDiv = document.getElementById('layerGroup0');
    if (!layerDiv) return;
    
    // Initial timeout to allow the canvas to fully render
    const initTimeout = setTimeout(() => {
      updateDimensions();
      detectZoomChanges();
    }, 500);
    
    // Function to update image dimensions
    const updateDimensions = () => {
      const canvas = layerDiv.querySelector('canvas');
      if (canvas) {
        setImageDimensions({
          width: canvas.width,
          height: canvas.height
        });
      }
    };
    
    // Function to track cursor position
    const handleMouseMove = (e) => {
      const rect = layerDiv.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      setCursorPosition({ x, y });
    };
    
    // Function to detect zoom level changes
    const detectZoomChanges = () => {
      // Try to find zoom info from DWV
      const zoomText = document.querySelector('.infoLayer .info-tr .zoom-tr');
      if (zoomText) {
        const zoomMatch = zoomText.textContent.match(/\d+(\.\d+)?/);
        if (zoomMatch) {
          setZoomLevel(parseFloat(zoomMatch[0]));
        }
      } else {
        // Alternatively look for scale transform on the canvas
        const canvas = layerDiv.querySelector('canvas');
        if (canvas && canvas.style.transform) {
          const scaleMatch = canvas.style.transform.match(/scale\((\d+\.?\d*)\)/);
          if (scaleMatch && scaleMatch[1]) {
            setZoomLevel(parseFloat(scaleMatch[1]));
          }
        }
      }
      
      // Always update dimensions when zoom might have changed
      updateDimensions();
    };
    
    // Initial update
    updateDimensions();
    
    // Add event listeners
    layerDiv.addEventListener('mousemove', handleMouseMove);
    
    // Create observer to detect canvas changes (including zoom)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        detectZoomChanges();
      });
    });
    
    // Watch for changes in the layer div
    observer.observe(layerDiv, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'width', 'height']
    });
    
    // Clean up
    return () => {
      clearTimeout(initTimeout);
      layerDiv.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);
  return (
    <div style={{ flex: 1, position: "relative" }} className="relative flex-grow bg-[#000]">
      <div className="relative flex-grow h-full">
        {loadProgress !== 100 && (
          <LinearProgress variant="determinate" value={loadProgress} />
        )}
        <div
          id="layerGroup0"
          className="layerGroup  !bg-[#000] text-white"
          style={{
            filter: `invert(${isInvert ? 1 : 0}) brightness(${brightness}) contrast(${brightness})`,
            transform: `rotate(${rotateValue}deg)`,
            transformOrigin: "center",
            height: "100%",
          }}
        >
          <div id="dropBox" style={{ backgroundColor: "black!important" }}></div>
          {/* Bottom-left Patient Info */}
        </div>
        {/* Patient Info at bottom-left - hide on mobile when sidebar is open */}
        {/* {patient && ( */}
          <div className={`absolute bottom-24 md:bottom-4 left-4 z-40 bg-white flex flex-col md:flex-row md:gap-2 dark:bg-gray-700 text-xs md:text-sm text-black dark:text-white px-2 md:px-3 py-1 rounded shadow ${activeSidebar ? 'hidden md:flex' : 'flex'}`}>
            <span className="font-semibold">Age: {patient?.age}</span>
            <span className="font-semibold">Gender: {patient?.gender || 'Others'}</span>
          </div>
        {/* )} */}
        
        {/* Image dimensions and cursor position display - only show when dimensions are available and sidebar is closed */}
        {imageDimensions.width > 0 && !activeSidebar && (
          <div className="absolute bottom-2 left-4 md:left-auto md:right-16 py-1 md:py-1.5 px-2 md:px-2.5 z-40 bg-black bg-opacity-70 text-white text-[10px] md:text-xs rounded-md max-w-[140px] md:max-w-[180px] mb-1 transform hover:scale-105 transition-all duration-200 shadow-lg">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <div className="flex items-center justify-between space-x-1 md:space-x-2">
              <span className="opacity-80">Canvas:</span>
              <span className="font-medium">{imageDimensions.width} × {imageDimensions.height}</span>
            </div>
            <div className="flex items-center justify-between space-x-1 md:space-x-2">
              <span className="opacity-80">Cursor:</span>
              <span className="font-medium">{cursorPosition.x}, {cursorPosition.y}</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DvwViewer;
