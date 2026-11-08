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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReportService } from "../services/Reports.service";
import {
  ReportStatusProvider,
  useReportStatusContext,
} from "../context/ReportStatusContext";
import useReportStatus, { STATUS } from "../hooks/useReportStatus";
import useReportBeacon from "../hooks/useReportBeacon";

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
  // Removed showDrawTooList since Draw is now icon buttons

  const { id } = useParams(); // 🧠 matches :id from route
  const location = useLocation();
  const navigate = useNavigate();
  const { changeStatus } = useReportStatus();
  const { triggerBeacon } = useReportBeacon(
    id,
    location.state?.fromIdleReports || false
  );
  const [reportStatus, setReportStatus] = useState(null);
  const [patient, setPatient] = useState({
    age: null,
    gender: null,
  });
  const [fileList, setFileList] = useState([]); // list of files from backend
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [selectedShape, setSelectedShape] = useState("Rectangle");
  const [dwvApp, setDwvApp] = useState(null);
  const [metaData, setMetaData] = useState({});
  const [orientation, setOrientation] = useState(undefined);
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [lastSidebar, setLastSidebar] = useState("chat"); // default fallback
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [brightness, setBrightness] = useState(1); // CSS brightness for images

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
    // For image files, disable only Scroll tool, enable others if loaded
    if (activeFile?.type === "image") {
      if (tool === "Scroll") return false;
      return dataLoaded;
    }
    // For DICOM, check DWV app and method existence
    if (!dwvAppRef.current) return false;
    if (tool === "Scroll")
      return typeof dwvAppRef.current.canScroll === "function"
        ? dwvAppRef.current.canScroll()
        : false;
    if (tool === "WindowLevel")
      return typeof dwvAppRef.current.canWindowLevel === "function"
        ? dwvAppRef.current.canWindowLevel()
        : false;
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

  const toolsButtons = [];
  _tools.forEach((tool) => {
    const isActive = _selectedTool.find((t) => tool.title === t.title);
    if (tool.title === "Draw") {
      // Render each Draw shape as an individual icon button
      const shapeIcons = {
        Ruler: (props) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-ruler-icon lucide-ruler w-6 h-6"
            {...props}
          >
            <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
            <path d="m14.5 12.5 2-2" />
            <path d="m11.5 9.5 2-2" />
            <path d="m8.5 6.5 2-2" />
            <path d="m17.5 15.5 2-2" />
          </svg>
        ),
        Arrow: (props) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            {...props}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3"
            />
          </svg>
        ),
        Protractor: (props) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-drafting-compass-icon lucide-drafting-compass"
            {...props}
          >
            <path d="m12.99 6.74 1.93 3.44" />
            <path d="M19.136 12a10 10 0 0 1-14.271 0" />
            <path d="m21 21-2.16-3.84" />
            <path d="m3 21 8.02-14.26" />
            <circle cx="12" cy="5" r="2" />
          </svg>
        ),
        Circle: (props) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            {...props}
          >
            <circle
              cx="12"
              cy="12"
              r="7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        ),
        Rectangle: (props) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            {...props}
          >
            <rect
              x="4.5"
              y="4.5"
              width="15"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        ),
      };
      tools.Draw.options.forEach((shape) => {
        const isShapeActive =
          selectedTool === "Draw" && selectedShape === shape;
        toolsButtons.push(
          <button
            key={`Draw-${shape}`}
            disabled={!dataLoaded || !canRunTool("Draw")}
            onClick={() => {
              _onChangeTool(tool, shape);
            }}
            className="cursor-pointer"
          >
            {getToolIcon(
              {
                ...tool,
                icon: shapeIcons[shape],
                title: shape,
              },
              !dataLoaded || !canRunTool("Draw"),
              isShapeActive
            )}
          </button>
        );
      });
    } else {
      toolsButtons.push(
        <button
          key={tool.id}
          disabled={!dataLoaded || !canRunTool(tool.id)}
          onClick={() => {
            if (tool.title === "Invert") setIsInvert((v) => !v);
            if (tool.title === "Rotate") {
              setRotateValue((v) => (v === 270 ? 0 : v + 90));
            }
            _onChangeTool(tool);
          }}
          className="cursor-pointer relative"
        >
          {getToolIcon(tool, !dataLoaded || !canRunTool(tool.id), isActive)}
        </button>
      );
    }
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

  // Handle browser back button
  useEffect(() => {
    const handlePopstate = async () => {
      if (
        location.state?.fromIdleReports &&
        (reportStatus === STATUS.ACCEPTED)
      ) {
        try {
          const success = await triggerBeacon();
          if (!success) {
            await Promise.all([
              changeStatus(id, STATUS.IDLE),
              ReportService.editReport(id, { radiologist: null }),
            ]);
          }
          sessionStorage.setItem("refreshIdleReports", "true");
        } catch (err) {
          console.error("Error resetting report on browser back:", err);
        }
      }
      navigate("/", {
        state: {
          refresh: location.state?.fromIdleReports,
          timestamp: new Date().getTime(),
        },
      });
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [location.state, reportStatus, id, navigate, changeStatus, triggerBeacon]);

  useEffect(() => {
    // Only attach if tool is Contrast/WindowLevel and file is image
    if (selectedTool === "WindowLevel" && activeFile?.type === "image") {
      const container = document.getElementById("layerGroup0");
      if (!container) return;
      let isDragging = false;
      let lastX = 0;
      let lastY = 0;
      const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
      function onMouseDown(e) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
      function onMouseMove(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        let change = 0;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal drag
          change = deltaX > 0 ? 0.05 : -0.05;
        } else if (Math.abs(deltaY) > 0) {
          // Vertical drag
          change = deltaY > 0 ? 0.05 : -0.05;
        }
        if (change !== 0)
          setBrightness((prev) =>
            clamp(Number((prev + change).toFixed(2)), 0.1, 3)
          );
      }
      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
      container.addEventListener("mousedown", onMouseDown);
      return () => {
        container.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [selectedTool, activeFile]);

  useEffect(() => {
    if (activeFile?.type === "dicom") {
      const dropBox = document.getElementById("dropBox");
      if (dropBox) dropBox.innerHTML = ""; // Clear image overlay
    }
  }, [activeFile]);

  // Reset brightness when a new image is selected
  useEffect(() => {
    if (activeFile?.type === "image") {
      setBrightness(1);
    } else {
      setBrightness(1);
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
    <ReportStatusProvider>
      <div
        id="dwv"
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column", // Top to bottom layout
          position: "relative",
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
          fromIdleReports={location.state?.fromIdleReports || false}
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
            brightness={brightness}
            activeFile={activeFile}
            dwvApp={dwvAppRef.current}
            selectedTool={selectedTool}
            onChangeTool={onChangeTool}
            activeSidebar={activeSidebar}
          />

          {/* Sidebar Toggle + Panel */}
          <DvwActionSidebar
            setPatient={setPatient}
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
            lastSidebar={lastSidebar}
            toggleSidebar={toggleSidebar}
            currentStatus={reportStatus}
            reportId={id}
          />
        </div>
      </div>
    </ReportStatusProvider>
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
