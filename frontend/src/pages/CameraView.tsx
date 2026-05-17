import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useStore } from '../store/useStore';
import { TopAppBar } from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import { NotificationToast } from '../components/NotificationToast';
import { FaceRecognitionCard } from '../components/FaceRecognitionCard';
import { Icon } from '../components/ui/Icon';
import { PersonMemory } from '../types';

export default function CameraView() {
  const webcamRef = useRef<Webcam>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [recognizedFace, setRecognizedFace] = useState<{
    name: string;
    relationship?: string;
    confidence: number;
  } | null>(null);
  const [recognizedObjects, setRecognizedObjects] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Local state for toast and recognized person (store fields not yet added)
  const [toastVisible, setToastVisible] = useState(true);
  const [recognizedPerson, setRecognizedPerson] = useState<PersonMemory | null>(null);

  const { people, objects, setLocation, places, addEvent } = useStore();

  // ── Load AI models ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        const net = await cocoSsd.load();
        (window as any).cocoModel = net;

        setIsModelsLoaded(true);
      } catch (err) {
        console.error('AI Models failed to load', err);
      }
    };
    loadModels();
  }, []);

  // ── Geolocation watch ───────────────────────────────────────────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setLocation(pos.coords.latitude, pos.coords.longitude),
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000 },
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [setLocation]);

  // ── Main detection loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isModelsLoaded) return;

    let isRunning = true;

    const labeledDescriptors = people
      .filter((p) => p.face_descriptor)
      .map(
        (p) =>
          new faceapi.LabeledFaceDescriptors(p.id, [
            new Float32Array(p.face_descriptor!),
          ]),
      );

    const faceMatcher =
      labeledDescriptors.length > 0
        ? new faceapi.FaceMatcher(labeledDescriptors, 0.6)
        : null;

    const detect = async () => {
      if (
        !isRunning ||
        !webcamRef.current?.video ||
        webcamRef.current.video.readyState !== 4
      ) {
        requestAnimationFrame(detect);
        return;
      }

      const video = webcamRef.current.video;

      // Face detection
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0 && faceMatcher) {
        const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
        if (bestMatch.label !== 'unknown') {
          const person = people.find((p) => p.id === bestMatch.label);
          if (person) {
            setRecognizedFace({
              name: person.name,
              relationship: person.relationship,
              confidence: 1 - bestMatch.distance,
            });
            setRecognizedPerson(person);
          }
        } else {
          setRecognizedFace(null);
          setRecognizedPerson(null);
        }
      } else {
        setRecognizedFace(null);
        setRecognizedPerson(null);
      }

      // Object detection
      if ((window as any).cocoModel) {
        const objDetections = await (window as any).cocoModel.detect(video);
        const labels = objDetections
          .filter((d: any) => d.score > 0.6)
          .map((d: any) => {
            const custom = objects.find((o) => o.coco_class === d.class);
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

  // ── Voice assistant ─────────────────────────────────────────────────────────
  const toggleListen = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
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
      console.log('Heard:', transcript);

      const possibleNames = transcript.match(/\b[A-Z][a-z]+\b/g) || [];

      addEvent({
        id: crypto.randomUUID(),
        transcript,
        extracted_names: possibleNames,
        is_verified: false,
        created_at: new Date().toISOString(),
      });

      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // ── Nearest place name ──────────────────────────────────────────────────────
  const getNearestPlaceName = (): string => {
    if (places.length === 0) return 'an unknown location';
    return places[0].name;
  };

  return (
    <>
      {/* ── z-0: Fixed camera background ─────────────────────────────────── */}
      <div className="fixed inset-0 z-0 bg-surface-container-highest overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.92}
          videoConstraints={{ facingMode: 'environment' }}
          className="w-full h-full object-cover"
          disablePictureInPicture={false}
          forceScreenshotSourceSize={false}
          imageSmoothing={true}
          mirrored={false}
          minScreenshotHeight={undefined}
          minScreenshotWidth={undefined}
          onUserMedia={undefined}
          onUserMediaError={undefined}
        />
      </div>

      {/* ── z-10: AR overlay tint ─────────────────────────────────────────── */}
      <div className="fixed inset-0 z-10 bg-primary/5 mix-blend-multiply pointer-events-none" />

      {/* ── z-20: Accessibility grid overlay ─────────────────────────────── */}
      <div className="fixed inset-0 z-20 pointer-events-none border-[24px] border-transparent opacity-10">
        <div className="w-full h-full border border-primary/20 rounded-2xl" />
      </div>

      {/* ── z-40: Notification toast ──────────────────────────────────────── */}
      <NotificationToast
        icon="face_recognition"
        message="Sarah Johnson recognized nearby"
        onDismiss={() => setToastVisible(false)}
        visible={toastVisible}
      />

      {/* ── z-50: Top app bar (frosted glass) ────────────────────────────── */}
      <TopAppBar transparent />

      {/* ── AI loading overlay ───────────────────────────────────────────── */}
      {!isModelsLoaded && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-surface/90">
          <span
            className="material-symbols-outlined text-primary animate-spin mb-4"
            style={{ fontSize: 48 }}
          >
            progress_activity
          </span>
          <p className="font-headline-md text-headline-md text-on-surface mb-2">
            Loading AI Models…
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm text-center">
            MemoryLens runs locally in your browser for privacy. Downloading
            standard models once…
          </p>
        </div>
      )}

      {/* ── Main canvas: object detection labels ─────────────────────────── */}
      <main className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-container-margin">
        {recognizedObjects.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {recognizedObjects.map((obj) => (
              <span
                key={obj}
                className="bg-surface-container/90 backdrop-blur-sm text-on-surface px-4 py-1.5 rounded-full font-label-lg text-label-lg shadow-sm whitespace-nowrap"
              >
                {obj}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* ── Face recognition card: fixed above bottom nav ────────────────── */}
      {recognizedPerson && (
        <div className="fixed bottom-24 left-[24px] right-[24px] z-40">
          <FaceRecognitionCard
            person={recognizedPerson}
            lastConversation={
              recognizedFace && recognizedFace.confidence > 0.75
                ? `Recognized with ${(recognizedFace.confidence * 100).toFixed(0)}% confidence`
                : 'I may have seen this person before'
            }
            onCall={() => {
              console.log('Call', recognizedPerson.name);
            }}
            onPhotos={() => {
              console.log('Photos for', recognizedPerson.name);
            }}
            visible={true}
          />
        </div>
      )}

      {/* ── z-50: Purple FAB mic button ───────────────────────────────────── */}
      <div className="fixed bottom-28 right-container-margin z-50">
        <button
          onClick={toggleListen}
          aria-label="Activate voice assistant"
          className={[
            'w-16 h-16 rounded-full shadow-2xl flex items-center justify-center',
            'active:scale-95 duration-150 transition-all',
            isListening
              ? 'bg-error animate-pulse'
              : 'bg-secondary text-on-secondary',
          ].join(' ')}
        >
          <Icon name="mic" size={32} filled className="text-on-secondary" />
        </button>
      </div>

      {/* ── z-50: Bottom nav ─────────────────────────────────────────────── */}
      <BottomNav currentPath="/" />
    </>
  );
}
