import React, { useState, useEffect, useRef, useCallback } from "react";
import { withStyles } from "@mui/styles";
import ToggleButton from "@mui/material/ToggleButton";
import { toPng, toJpeg, toBlob } from "html-to-image";
import ContrastIcon from "@mui/icons-material/Contrast";
import Slide from "@mui/material/Slide";
import "./DwvComponent.css";
import { App, getDwvVersion, decoderScripts } from "dwv";
import {
  DesignServices,
  InvertColors,
  Pinch,
  Rotate90DegreesCcw,
} from "@mui/icons-material";
import {
  PlayCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import ControlPanel from "./ControlPanel";
import DvwSidebar from "./DvwSidebar";
import DvwViewer from "./DvwViewer";
import DvwActionSidebar from "./DvwActionSidebar";
import { useParams } from "react-router-dom";
import { ReportService } from "../services/Reports.service";

decoderScripts.jpeg2000 = `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpeg2000.js`;
decoderScripts[
  "jpeg-lossless"
] = `${process.env.PUBLIC_URL}/assets/dwv/decoders/rii-mango/decode-jpegloss.js`;
decoderScripts[
  "jpeg-baseline"
] = `${process.env.PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpegbaseline.js`;
decoderScripts.rle = `${process.env.PUBLIC_URL}/assets/dwv/decoders/dwv/decode-rle.js`;

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    flex: "0 0 auto",
  },
  iconSmall: {
    fontSize: 20,
  },
});

export const TransitionUp = React.forwardRef((props, ref) => (
  <Slide direction="up" {...props} ref={ref} />
));

function DwvComponent({ classes }) {
  // --- State ---
  const [versions] = useState({
    dwv: getDwvVersion(),
    react: React.version,
  });
  const [tools] = useState({
    Scroll: {},
    ZoomAndPan: {},
    WindowLevel: {},
    Draw: {
      options: ["Ruler", "Arrow", "Protractor", "Circle", "Rectangle"],
    },
    Invert: {},
    Rotate: {
      options: [0, 90, 180, 270],
      selected: 0,
    },
  });
  const [_tools, _setTools] = useState([
    {
      id: "Scroll",
      title: "Scroll",
      isMulti: false,
      icon: PlayCircleIcon,
    },
    {
      id: "ZoomAndPan",
      title: "Pan",
      isMulti: false,
      icon: Pinch,
    },
    {
      id: "Draw",
      title: "Draw",
      isMulti: false,
      icon: DesignServices,
    },
    {
      id: "WindowLevel",
      title: "Contrast",
      isMulti: true,
      icon: ContrastIcon,
    },
    {
      id: "Invert",
      title: "Invert",
      isMulti: true,
      icon: InvertColors,
    },
    {
      id: "Rotate",
      title: "Rotate",
      isMulti: true,
      icon: Rotate90DegreesCcw,
      meta: {
        options: [0, 90, 180, 270],
        state: 0,
      },
    },
  ]);
  const [isInvert, setIsInvert] = useState(false);
  const [rotateValue, setRotateValue] = useState(0);
  const [_selectedTool, _setSelectedTool] = useState([
    {
      id: "WindowLevel",

      title: "Contrast",
      isMulti: false,
    },
  ]);
  const [selectedTool, setSelectedTool] = useState("WindowLevel");
  const [showDrawTooList, setShowDrawList] = useState(false);
  const [selectedShape, setSelectedShape] = useState("Rectangle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dwvApp, setDwvApp] = useState(null);
  const [metaData, setMetaData] = useState({});
  const [orientation, setOrientation] = useState(undefined);
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [lastSidebar, setLastSidebar] = useState("chat"); // default fallback
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]); // list of files from backend
  const [activeFile, setActiveFile] = useState(null);
  const { id } = useParams(); // 🧠 matches :id from route
  const [loading, setLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [patient, setPatient] = useState({
    age: null,
    gender: null,
  });

  // --- Refs ---
  const dropboxDivId = "dropBox";
  const dropboxClassName = "dropBox";
  const borderClassName = "dropBoxBorder";
  const hoverClassName = "hover";
  const dwvAppRef = useRef(null);

  // --- DWV App Setup ---
  function initializeDwvApp() {
    const app = new App();
    dwvAppRef.current = app;

    let nLoadItem = 0;
    let nReceivedLoadError = 0;
    let nReceivedLoadAbort = 0;
    let isFirstRender = true;

    app.init({
      dataViewConfigs: { "*": [{ divId: "layerGroup0" }] },
      tools,
      gui: {
        colorLUTs: [
          { name: "Gray", value: "gray" },
          /* other LUTs if needed */
        ],
      },
    });

    app.addEventListener("loadstart", () => {
      nLoadItem = 0;
      nReceivedLoadError = 0;
      nReceivedLoadAbort = 0;
      isFirstRender = true;
      showDropbox(app, false);
    });

    app.addEventListener("loadprogress", (event) => {
      setLoadProgress(event.loaded);
    });

    app.addEventListener("renderend", () => {
      if (isFirstRender) {
        isFirstRender = false;
        const tool = "WindowLevel";
        // const tool = app.canScroll() ? "WindowLevel" : "ZoomAndPan";
        onChangeTool(tool);
      }
    });

    app.addEventListener("load", (event) => {
      setMetaData(app.getMetaData(event.dataid));
      setDataLoaded(true);
    });

    app.addEventListener("loadend", () => {
      if (nReceivedLoadError) {
        setLoadProgress(0);
        console.log("Received errors during load. Check log for details.");
        if (!nLoadItem) {
          showDropbox(app, true);
        }
      }
      if (nReceivedLoadAbort) {
        setLoadProgress(0);
        alert("Load was aborted.");
        showDropbox(app, true);
      }
    });

    app.addEventListener("loaditem", () => {
      ++nLoadItem;
    });

    app.addEventListener("loaderror", (event) => {
      console.error(event.error);
      ++nReceivedLoadError;
    });

    app.addEventListener("loadabort", () => {
      ++nReceivedLoadAbort;
    });

    app.addEventListener("keydown", (event) => {
      app.defaultOnKeydown(event);
    });

    window.addEventListener("resize", app.onResize);

    setDwvApp(app);
    setupDropbox(app);
    app.loadFromUri(window.location.href);

    return app;
  }

  useEffect(() => {
    const app = initializeDwvApp();
    return () => {
      window.removeEventListener("resize", app.onResize);
    };
    // eslint-disable-next-line
  }, []);

  // --- Dropbox Setup ---
  const setupDropbox = useCallback((app) => {
    showDropbox(app, true);
    // eslint-disable-next-line
  }, []);

  const defaultHandleDragEvent = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const onBoxDragOver = (event) => {
    defaultHandleDragEvent(event);
    const box = document.getElementById(dropboxDivId);
    if (box && box.className.indexOf(hoverClassName) === -1) {
      box.className += " " + hoverClassName;
    }
  };

  const onBoxDragLeave = (event) => {
    defaultHandleDragEvent(event);
    const box = document.getElementById(dropboxDivId);
    if (box && box.className.indexOf(hoverClassName) !== -1) {
      box.className = box.className.replace(" " + hoverClassName, "");
    }
  };

  const onDrop = (event) => {
    defaultHandleDragEvent(event);
    if (dwvAppRef.current) {
      dwvAppRef.current.loadFiles(event.dataTransfer.files);
    }
  };

  const onInputFile = (event) => {
    if (event.target && event.target.files && dwvAppRef.current) {
      dwvAppRef.current.loadFiles(event.target.files);
    }
  };

  function showDropbox(app, show) {
    const box = document.getElementById(dropboxDivId);
    if (!box) return;
    const layerDiv = document.getElementById("layerGroup0");

    if (show) {
      box.className = dropboxClassName + " " + borderClassName;
      if (box.innerHTML === "") {
        const p = document.createElement("p");
        // p.appendChild(document.createTextNode("Drag and drop data here or "));
        const input = document.createElement("input");
        input.onchange = onInputFile;
        input.type = "file";
        input.multiple = true;
        input.id = "input-file";
        input.style.display = "none";
        const label = document.createElement("label");
        label.htmlFor = "input-file";
        const link = document.createElement("a");
        // link.appendChild(document.createTextNode("click here"));
        link.id = "input-file-link";
        label.appendChild(link);
        p.appendChild(input);
        p.appendChild(label);
        box.appendChild(p);
      }
      box.setAttribute("style", "display:initial");
      if (layerDiv) {
        layerDiv.removeEventListener("dragover", defaultHandleDragEvent);
        layerDiv.removeEventListener("dragleave", defaultHandleDragEvent);
        layerDiv.removeEventListener("drop", onDrop);
      }
      box.addEventListener("dragover", onBoxDragOver);
      box.addEventListener("dragleave", onBoxDragLeave);
      box.addEventListener("drop", onDrop);
    } else {
      box.className = dropboxClassName;
      box.innerHTML = "";
      box.setAttribute("style", "display:none");
      box.removeEventListener("dragover", onBoxDragOver);
      box.removeEventListener("dragleave", onBoxDragLeave);
      box.removeEventListener("drop", onDrop);
      if (layerDiv) {
        layerDiv.addEventListener("dragover", defaultHandleDragEvent);
        layerDiv.addEventListener("dragleave", defaultHandleDragEvent);
        layerDiv.addEventListener("drop", onDrop);
      }
    }
  }

  // --- Tool Logic ---
  const getToolIcon = (tool, isDisabled = false, isActive = false) => {
    const Icon = tool.icon;

    // Determine if tool is "active" (highlighted)
    let isActiveTool = false;
    if (tool.title === "Rotate") {
      isActiveTool = !!rotateValue;
    } else if (tool.title === "Invert") {
      isActiveTool = isInvert;
    } else {
      isActiveTool = isActive;
    }

    // Base container class
    const baseClasses =
      "p-1 rounded-lg flex gap-2 items-center transition-colors duration-200";

    // Active tool: highlight with primary color
    const activeClasses = isActiveTool
      ? "bg-primary-light dark:bg-primary text-black dark:text-white"
      : "hover:bg-primary-light dark:hover:bg-gray-dark text-black dark:text-white";

    // Disabled styling
    const disabledClasses = isDisabled
      ? "text-gray-light dark:text-gray-600 hover:bg- dark:hover:!bg-[#000] opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    return (
      <div className="flex flex-col justify-center items-center gap-1">
        <div className={`${baseClasses} ${activeClasses} ${disabledClasses}`}>
          <Icon className="w-6 h-6" />
          {tool.title === "Draw" &&
            (showDrawTooList ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            ))}
        </div>
        <p
          className={`text-xs font-medium ${
            isDisabled
              ? "text-gray-light dark:text-gray-600"
              : "text-black dark:text-white"
          }`}
        >
          {tool.title}
        </p>
      </div>
    );
  };

  const canRunTool = (tool) => {
    // console.log({ can: dwvAppRef.current.canWindowLevel(), tool });
    if (!dwvAppRef.current) return false;
    if (tool === "Scroll") return dwvAppRef.current.canScroll();
    if (tool === "WindowLevel") return dwvAppRef.current.canWindowLevel();
    return true;
  };

  const onChangeTool = (tool, option) => {
    if (dwvAppRef.current) {
      setSelectedTool(tool);
      // _setSelectedTool((prev) => [...prev, tool]);
      dwvAppRef.current.setTool(tool);
      if (tool === "Draw") {
        onChangeShape(option);
      }
    }
  };

  const _onChangeTool = (tool, option) => {
    if (typeof tool === "object")
      if (dwvAppRef.current) {
        const foundTool = _selectedTool.find((t) => t.title === tool.title);
        if (!foundTool) {
          onChangeTool(tool.id, option);

          if (tool.isMulti) {
            _setSelectedTool((prev) => [
              ...prev,
              {
                title: tool.title,
                isMulti: tool.isMulti,
              },
            ]);
          } else {
            if (tool.title === "Draw") {
              _setSelectedTool((prev) => [
                ...prev.filter((t) => t.isMulti !== false),
                { title: tool.title, isMulti: tool.isMulti, value: option },
              ]);
            } else {
              _setSelectedTool((prev) => [
                ...prev.filter((t) => t.isMulti !== false),
                { title: tool.title, isMulti: tool.isMulti },
              ]);
            }
          }
        } else {
          if (tool.title === "Draw") {
            _setSelectedTool((prev) =>
              prev.map((t) => {

                if (tool.title === "Draw") {
                  if (t.value === option) {
                    return prev.filter((t) => t.title !== tool.title);
                  } else {
                    onChangeTool(tool.id, option);

                    return { ...t, value: option };
                  }
                }
                return t;
              })
            );
          } else {
            _setSelectedTool((prev) =>
              prev.filter((t) => t.title !== tool.title)
            );
          }
        }
      }
  };
  const onChangeShape = (shape) => {
    if (dwvAppRef.current) {
      dwvAppRef.current.setToolFeatures({ shapeName: shape });
      setSelectedShape(shape);
    }
  };

  // --- Screenshot/Print ---
  const handleDownloadImage = async () => {
    try {
      const element = document.getElementById("layerGroup0");
      if (!element) throw new Error("DICOM viewer element not found");
      setIsDownloading(true);
      const dataUrl = await toPng(element, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `dicom-viewer-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Sidebar ---
  const toggleSidebar = (panel) => {
    if (activeSidebar === panel) {
      setActiveSidebar(null); // close if clicked again
    } else {
      setActiveSidebar(panel);
      if (panel) setLastSidebar(panel); // remember last opened
    }
  };

  // --- Render ---
  // const toolsButtons = Object.keys(tools).map((tool) => (
  //   <button
  //     value={tool}
  //     key={tool}
  //     title={tool}
  //     disabled={!dataLoaded || !canRunTool(tool)}
  //     onClick={() => {
  //       if (tool === "Invert") setIsInvert((v) => !v);
  //       if (tool === "Rotate") setRotateValue((v) => v + 90);
  //       onChangeTool(tool);
  //     }}
  //   >
  //     {getToolIcon(tool)}
  //   </button>
  // ));

  const drawOptions = tools.Draw.options.map((shape) => (
    <ToggleButton
      value={shape}
      key={shape}
      title={shape}
      disabled={!dataLoaded || selectedTool !== "Draw"}
      onClick={() => onChangeShape(shape)}
    >
      {shape}
    </ToggleButton>
  ));

  const toolsButtons = _tools.map((tool) => {
    const isActive = _selectedTool.find((t) => tool.title === t.title);
    return (
      <button
        key={tool.id}
        disabled={!dataLoaded || !canRunTool(tool.id)}
        onClick={() => {
          if (tool.title === "Draw") {
            setShowDrawList(!showDrawTooList);
            return;
          }
          if (tool.title === "Invert") setIsInvert((v) => !v);
          if (tool.title === "Rotate") {
            setRotateValue((v) => (v === 270 ? 0 : v + 90));
          }
          // onChangeTool(tool);
          _onChangeTool(tool);
        }}
        className="cursor-pointer relative"
      >
        {tool.title === "Draw" && isActive && (
          <span className="absolute top-[-1.725rem] p-1 right-0 text-xs bg-black rounded-md">
            {selectedShape}
          </span>
        )}
        {getToolIcon(tool, !dataLoaded || !canRunTool(tool.id), isActive)}

        {showDrawTooList && tool.title == "Draw" && (
          <ul
            type="none"
            className="z-50 flex flex-col absolute top-[2.5rem] bg-white dark:bg-black border border-slate-400"
          >
            {tools.Draw.options.map((opt) => {
              return (
                <li
                  key={opt}
                  className="block border border-b-slate-600 px-1 py-2 text-xs text-left hover:bg-slate-400"
                  onClick={() => {
                    _onChangeTool(tool, opt);
                  }}
                >
                  {opt}
                </li>
              );
            })}
          </ul>
        )}
      </button>
    );
  });

  useEffect(() => {
    const myFile = [
      {
        name: "xray_lung.jpg",
        url: "https://images.unsplash.com/photo-1747635351683-002a277ed3ee?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        type: "image",
      },
    ];
    async function fetchReportFiles() {
      setLoading(true);
      if (!id) return;
      try {
        const report = await ReportService.getReport(id);

        // Extract status
        setReportStatus(report.status); // ✅ Save it in state (add useState for this)
        // Extract status
        setReportStatus(report.status); // ✅ Save it in state (add useState for this)

        const fileList = (report.signedReportUrls || []).map((file) => {
          const ext = file.key.split(".").pop().toLowerCase();
          const type = ext === "dcm" ? "dicom" : "image";

          return {
            name: file.key, // Name intentionally left empty
            url: file.signedUrl,
            type, // Kept only for conditional rendering
          };
        });

        setFileList(fileList);
        if (fileList[0]) {
          setActiveFile(fileList[0]);
          handleFileClick(fileList[0]);
        }
      } catch (error) {
        setFileList([]);
        setActiveFile(null);
        setReportStatus(null);
      } finally {
        setLoading(false);
      }
    }
    fetchReportFiles();
  }, [id]);

  useEffect(() => {
    if (activeFile?.type === "dicom") {
      const dropBox = document.getElementById("dropBox");
      if (dropBox) dropBox.innerHTML = ""; // Clear image overlay
    }
  }, [activeFile]);

  // Auto-load file when activeFile changes
  // useEffect(() => {
  //   if (activeFile) {
  //     handleFileClick(activeFile);
  //   }
  // }, [activeFile]);

  const handleFileClick = async (path) => {
    try {
      const layerViewDivs = document.querySelectorAll(".layer.viewLayer");
      layerViewDivs.forEach((div) => div.remove());
      const layerElt = document.querySelector("#layerGroup0-layer-0");
      if (layerElt) {
        const canvaseElt = layerElt.querySelector("canvas");
        if (canvaseElt) canvaseElt.remove();
      }

      const app = dwvAppRef.current;
      // (Optional) Abort any pending load and reset the app
      try {
        app.abortLoad();
      } catch (e) {
        console.warn("No active load to abort:", e.message);
      }

      app.reset();
      // Fetch the file blob (as before) and load it
      const response = await fetch(path.url);
      if (!response.ok) throw new Error("File fetch or CORS error");
      const blob = await response.blob();
      const file = new File([blob], getFileNameFromPath(path.url), {
        type: blob.type,
      });
      setActiveFile(path);
      await app.loadURLs([path.url]);

      // await app.loadURLs([path.url], { forceLoader: "dicom" });
    } catch (error) {
      console.error("Error loading file:", error);
    } finally {
      setDataLoaded(false);
    }
  };

  function getFileNameFromPath(path) {
    // console.log({ path });
    return path.split("/").pop(); // or path.split("\\").pop() for Windows-style paths
  }

  return (
    // <ReportStatusProvider>
      <div
        id="dwv"
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column", // Top to bottom layout
          position: 'relative'
        }}
      >
        {/* Top Control Panel (Fixed Height) */}
        <ControlPanel
          reportId={id}
          currentStatus={reportStatus}
          onChangeTool={onChangeTool}
          toolsButtons={toolsButtons}
          dataLoaded={dataLoaded}
          handleDownloadImage={handleDownloadImage}
        />

        {/* Main Content Area (fills remaining height) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
        >
          {loading && (
           <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray dark:text-gray-light text-lg font-medium">
                Loading files...
              </span>
            </div>
          )}
          {/* File Viewer Sidebar */}
          <DvwSidebar
            activeFile={activeFile}
            fileList={fileList}
            handleFileClick={handleFileClick}
            loading={loading}
          />

          {/* Viewer Area */}
          <DvwViewer
            loadProgress={loadProgress}
            isInvert={isInvert}
            rotateValue={rotateValue}
            patient={patient}
            loading={loading}
          />

          {/* Sidebar Toggle + Panel */}
          <DvwActionSidebar
            setPatient={setPatient}
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
            lastSidebar={lastSidebar}
            toggleSidebar={toggleSidebar}
            reportId={id}
          />
        </div>
      </div>
    // </ReportStatusProvider>
  );
}

export default withStyles(styles)(DwvComponent);

// Utility functions remain unchanged
export async function captureDivById(
  elementId,
  { format = "png", quality = 1, download = true } = {}
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    let result;

    if (format === "jpeg") {
      result = await toJpeg(element, { quality });
    } else {
      result = await toPng(element);
    }

    if (download) {
      const link = document.createElement("a");
      link.download = `capture.${format}`;
      link.href = result;
      link.click();
    }

    return result;
  } catch (error) {
    console.error("Error capturing div:", error);
    throw error;
  }
}

/**
 * Capture as blob (for uploads)
 * @param {string} elementId - The ID of the div to capture
 * @returns {Promise<Blob>} Image blob
 */
export async function captureDivAsBlob(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    return await toBlob(element);
  } catch (error) {
    console.error("Error capturing div as blob:", error);
    throw error;
  }
}

function setCursorMode(mode) {
  const viewElement = document.querySelector("#layerGroup0");
  if (!viewElement) return;

  // Define cursors for different modes
  const cursorMap = {
    Scroll: "grab", // Scroll Play
    Play: "grab",
    ZoomAndPan: "zoom-in", // Zoom & Pan
    Pan: "move",
    Draw: "crosshair", // Draw Drawing
    Drawing: "crosshair",
    Contrast: "col-resize", // Contrast Adjust
    Contrasting: "col-resize",
    Invert: "not-allowed", // Invert Mode
    Inverting: "not-allowed",
    Rotate: "alias", // Rotate Mode
    Rotating: "alias",
  };

  // Get corresponding cursor
  const cursor = cursorMap[mode] || "default";

  // Set cursor
  viewElement.style.cursor = cursor;
}
