import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useStore } from '../store/useStore';
import { Loader2, Mic } from 'lucide-react';
import { format } from 'date-fns';

export default function CameraView() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [recognizedFace, setRecognizedFace] = useState<{name: string, relationship?: string, confidence: number} | null>(null);
  const [recognizedObjects, setRecognizedObjects] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  const { people, objects, setLocation, places, addEvent } = useStore();

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        // Ensure coco-ssd is loaded
        const net = await cocoSsd.load();
        (window as any).cocoModel = net; // store globally for continuous tracking

        setIsModelsLoaded(true);
      } catch (err) {
        console.error("AI Models failed to load", err);
      }
    };
    loadModels();
  }, []);

  // Update Location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [setLocation]);

  const getCurrentLocationName = () => {
    if (!currentLocation || places.length === 0) return 'an unknown location';
    let nearest = places[0];
    let minDist = 9999999;
    
    // Within 200 meters roughly to count as "at" the location
    if (minDist <= nearest.radius_meters) {
       return nearest.name;
    }
    return 'outside near ' + nearest.name;
  };

  // Main Detection Loop
  useEffect(() => {
    if (!isModelsLoaded) return;
    
    let isRunning = true;
    
    // We create a face matcher from our Zustands store of people if they have descriptors
    // Assuming face_descriptor is stored as an array of numbers, convert to Float32Array
    const labeledDescriptors = people
      .filter(p => p.face_descriptor)
      .map(p => new faceapi.LabeledFaceDescriptors(p.id, [new Float32Array(p.face_descriptor!)]));
      
    const faceMatcher = labeledDescriptors.length > 0 ? new faceapi.FaceMatcher(labeledDescriptors, 0.6) : null;

    const detect = async () => {
      if (!isRunning || !webcamRef.current?.video || webcamRef.current.video.readyState !== 4) {
        requestAnimationFrame(detect);
        return;
      }

      const video = webcamRef.current.video;
      
      // Face detection
      const detections = await faceapi.detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();
        
      if (detections.length > 0 && faceMatcher) {
        const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
        if (bestMatch.label !== 'unknown') {
          const person = people.find(p => p.id === bestMatch.label);
          if (person) {
            setRecognizedFace({
              name: person.name,
              relationship: person.relationship,
              confidence: 1 - bestMatch.distance // lower distance = higher confidence
            });
          }
        } else {
            setRecognizedFace(null);
        }
      } else {
          setRecognizedFace(null);
      }

      // Object detection
      if ((window as any).cocoModel) {
        const objDetections = await (window as any).cocoModel.detect(video);
        const labels = objDetections
          .filter((d: any) => d.score > 0.6)
          .map((d: any) => {
             // Check if custom object
             const custom = objects.find(o => o.coco_class === d.class);
             return custom ? custom.custom_label : d.class;
          });
          
        setRecognizedObjects(Array.from(new Set(labels)) as string[]);
      }

      requestAnimationFrame(detect);
    };

    detect();
    
    return () => {
      isRunning = false;
    };
  }, [isModelsLoaded, people, objects]);

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");
    
    if (isListening) {
        // we don't have a ref to the recognition instance here for simplicity, but we'll reset state
        setIsListening(false);
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Heard:", transcript);
        
        // Simple name extraction heuristic (capitalized words)
        const possibleNames = transcript.match(/\\b[A-Z][a-z]+\\b/g) || [];
        
        addEvent({
            id: crypto.randomUUID(),
            transcript,
            extracted_names: possibleNames,
            is_verified: false,
            created_at: new Date().toISOString()
        });
        
        setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="relative h-full w-full bg-[var(--color-natural-bg)] p-6 overflow-hidden flex flex-col gap-5 pb-24">
      {!isModelsLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-natural-bg)]/90 text-[var(--color-natural-text)]">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--color-natural-accent)]" />
          <p className="text-lg font-medium">Loading AI Models...</p>
          <p className="text-sm text-[var(--color-natural-text)]/70 max-w-sm text-center mt-2">MemoryLens runs locally in your browser for privacy. Downloading standard models once...</p>
        </div>
      )}

      {/* Top bar: Orientation / Header Status */}
      <header className="bg-[var(--color-natural-card)] rounded-[24px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-[8px] border-[var(--color-natural-accent)] z-10 w-full shrink-0">
        <p className="text-[28px] font-bold text-[var(--color-natural-text)] mb-1 leading-tight">
          {places.length > 0 ? getCurrentLocationName ? `You are at ${getCurrentLocationName()}` : "You are safe." : "Orientation is active."}
        </p>
        <p className="text-[18px] text-[#6b7280] leading-snug">
          It is {format(new Date(), 'h:mm a')} on a {format(new Date(), 'EEEE')}. You are safe.
        </p>
      </header>
      
      {/* Camera Viewport */}
      <div className="relative flex-grow bg-black rounded-[32px] border-[4px] border-[var(--color-natural-card)] shadow-[0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="object-cover h-full w-full"
        />

        {/* Overlay Label indicating AI is active */}
        <div className="absolute top-8 left-8 bg-white/90 px-5 py-3 rounded-full font-semibold flex items-center gap-2.5 border-2 border-[var(--color-natural-accent)] text-[var(--color-natural-text)] z-20">
          <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
          AI Recognition Active
        </div>
        
        {/* Overlays Wrapper */}
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-end">
          {/* Center: Detections (preserving logic, updating styling) */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            {recognizedFace && (
              <div className="bg-[var(--color-natural-card)] px-6 py-2 rounded-xl text-center shadow-md animate-in fade-in zoom-in duration-300 pointer-events-auto border-2 border-[var(--color-natural-accent)]">
                {recognizedFace.confidence > 0.75 ? (
                  <>
                    <h2 className="text-[18px] font-medium text-[var(--color-natural-text)] whitespace-nowrap">
                      {recognizedFace.name} {recognizedFace.relationship && `(${recognizedFace.relationship})`} - {(recognizedFace.confidence * 100).toFixed(0)}% Match
                    </h2>
                  </>
                ) : (
                  <div className="text-center">
                    <h2 className="text-[18px] font-medium text-[var(--color-natural-text)]">This may be {recognizedFace.name}</h2>
                    <p className="text-sm text-gray-500">I am not entirely sure.</p>
                  </div>
                )}
              </div>
            )}

            {recognizedObjects.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {recognizedObjects.map(obj => (
                  <span key={obj} className="bg-[var(--color-natural-accent)] text-[var(--color-natural-card)] px-4 py-1.5 rounded-xl font-medium shadow-sm whitespace-nowrap text-lg">
                    {obj}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Bottom floating button for speech */}
          <div className="flex justify-end pointer-events-auto mb-4 mr-4">
             <button 
               onClick={toggleListen}
               className={`p-4 rounded-full shadow-xl transition-all ${isListening ? 'bg-[var(--color-natural-alert)] animate-pulse' : 'bg-[var(--color-natural-accent)] hover:opacity-90'}`}
             >
               <Mic className="w-8 h-8 text-white" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
