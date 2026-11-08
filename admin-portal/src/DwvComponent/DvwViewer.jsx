import { LinearProgress } from "@mui/material";
import React from "react";

const DvwViewer = ({ loadProgress, isInvert, rotateValue, patient = {} }) => {
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
            filter: `invert(${isInvert ? 1 : 0})`,
            transform: `rotate(${rotateValue}deg)`,
            transformOrigin: "center",
            height: "100%",
          }}
        >
          <div id="dropBox" style={{ backgroundColor: "black!important" }}></div>
          {/* Bottom-left Patient Info */}
        </div>
        {/* Patient Info at bottom-left */}
        {/* {patient && ( */}
          <div className="absolute bottom-4 left-4 z-40 bg-white flex gap-2 dark:bg-gray-700 text-sm text-black dark:text-white px-3 py-1 rounded shadow">
            <span className="font-semibold">Age: {patient?.age}</span>

            <span className="font-semibold">Gender: {patient?.gender || 'Others'}</span>
             
          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default DvwViewer;
