import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import TrackingGraph from "./TrackingGraph";
import html2canvas from "html2canvas";
import "@tensorflow/tfjs-backend-wasm";

const Hero = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [personCount, setPersonCount] = useState(0);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("wasm");
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model with WASM, switching to CPU:", error);
        await tf.setBackend("cpu");
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!model || !isCameraOn) return;

    let lastDetectionTime = 0;
    const debounceTime = 100;

    const detectObjects = async () => {
      const now = Date.now();
      if (now - lastDetectionTime < debounceTime) {
        requestAnimationFrame(detectObjects);
        return;
      }
      lastDetectionTime = now;

      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const predictions = await model.detect(video);
        setDetections(predictions);

        const peopleCount = predictions.filter(p => p.class === "person").length;
        setPersonCount(peopleCount);

        const newTrackingData = predictions.map(d => ({ x: d.bbox[0], y: d.bbox[1] }));
        setTrackingData(prev => [...prev.slice(-20), ...newTrackingData]);
      }
      requestAnimationFrame(detectObjects);
    };
    detectObjects();
  }, [model, isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    setDetections([]);
    setPersonCount(0);
    setTrackingData([]);
  };

  const saveDetections = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "detection_snapshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadGraph = async () => {
    if (!graphRef.current) return;

    const canvas = await html2canvas(graphRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "tracking_graph.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full h-screen flex flex-row items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 relative">
      <div className="w-1/2 flex flex-col items-center h-1/2" ref={graphRef}>
        <TrackingGraph trackingData={trackingData} detections={detections} className="h-full" />
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={saveDetections} 
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            Save Detection
          </button>
          <button 
            onClick={downloadGraph} 
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Download Graph
          </button>
        </div>
      </div>
      <div className="w-1/2 relative" ref={canvasRef}>
        {isCameraOn && (
          <Webcam 
            ref={webcamRef} 
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />
        )}
        {detections.map((detection, index) => (
          <div
            key={index}
            className="absolute border-2 border-red-500 bg-red-500 bg-opacity-50 text-white px-2 py-1 text-sm font-bold rounded"
            style={{
              left: `${detection.bbox[0]}px`,
              top: `${detection.bbox[1]}px`,
              width: `${detection.bbox[2]}px`,
              height: `${detection.bbox[3]}px`,
            }}
          >
            {detection.class} {index + 1}
          </div>
        ))}
      </div>
      <button 
        onClick={toggleCamera} 
        className="absolute bottom-6 left-10 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
      >
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
    </section>
  );
};

export default Hero;
