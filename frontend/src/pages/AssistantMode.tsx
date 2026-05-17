import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Icon } from '../components/ui/Icon';
import { TopAppBar } from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import { useStore } from '../store/useStore';

// ── Types ──────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

// ── Sample initial messages ────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Who is the woman at the door?',
    timestamp: '2:34 PM',
  },
  {
    id: '2',
    role: 'assistant',
    content: "That's Sarah Johnson, your daughter. She visited last Tuesday.",
    timestamp: '2:34 PM',
  },
];

const SUGGESTION_CHIPS = [
  'Who is this person?',
  'Where am I?',
  'What day is it?',
  'Call for help',
];

// ── Sub-components ─────────────────────────────────────────────────────────

interface UserMessageProps {
  message: Message;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-end w-full">
      <div
        className="bg-primary-container text-on-primary font-body-lg-mobile text-body-lg-mobile px-6 py-4 rounded-2xl rounded-tr-none chat-bubble-shadow max-w-[85%]"
        role="article"
        aria-label="Your message"
      >
        {message.content}
      </div>
      <span className="text-on-surface-variant font-label-lg text-sm mt-unit">
        {message.timestamp}
      </span>
    </div>
  );
}

interface AIMessageProps {
  message: Message;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-start w-full">
      <div
        className="bg-surface-container-lowest text-on-surface font-body-lg text-body-lg px-6 py-6 rounded-2xl rounded-tl-none privacy-glow"
        role="article"
        aria-label="Assistant message"
      >
        {/* Privacy label */}
        <div className="flex items-center gap-unit mb-4">
          <Icon
            name="lock"
            filled
            size={20}
            className="text-secondary"
            aria-hidden="true"
          />
          <span className="text-secondary font-label-lg tracking-wide text-sm">
            PRIVATE MEMORY RETRIEVAL
          </span>
        </div>

        {/* Message content */}
        <p className="mb-0">{message.content}</p>
      </div>
      <span className="text-on-surface-variant font-label-lg text-sm mt-unit">
        Assistant • Active Now
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function AssistantMode() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentLocation, places } = useStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Preserved utility functions ──────────────────────────────────────────

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371e3; // metres
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dp / 2) * Math.sin(dp / 2) +
      Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentLocationName = () => {
    if (!currentLocation || places.length === 0) return 'an unknown location';
    let nearest = places[0];
    let minDist = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      nearest.lat,
      nearest.lng,
    );
    for (let i = 1; i < places.length; i++) {
      const dist = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        places[i].lat,
        places[i].lng,
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = places[i];
      }
    }
    if (minDist <= nearest.radius_meters) {
      return nearest.name;
    }
    return 'outside near ' + nearest.name;
  };

  // ── Message sending ──────────────────────────────────────────────────────

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: format(new Date(), 'h:mm a'),
    };

    // Build a simple contextual reply
    let replyContent = "I'm looking into that for you. One moment.";
    const lower = text.toLowerCase();
    if (lower.includes('where am i') || lower.includes('location')) {
      const loc = getCurrentLocationName();
      replyContent = `You are currently at ${loc}. You are safe.`;
    } else if (lower.includes('time') || lower.includes('what time')) {
      replyContent = `It is ${format(new Date(), 'h:mm a')} on ${format(new Date(), 'EEEE, MMMM do')}.`;
    } else if (lower.includes('what day')) {
      replyContent = `Today is ${format(new Date(), 'EEEE, MMMM do, yyyy')}.`;
    } else if (lower.includes('who is') || lower.includes('who was')) {
      replyContent =
        "I'm checking my memory records for that person. Please hold the camera steady.";
    } else if (lower.includes('call for help')) {
      replyContent =
        'Connecting you to your emergency contact now. Please stay calm.';
    } else if (lower.includes('keys')) {
      replyContent =
        'I last detected your keys near the front door hook at 8:45 AM this morning.';
    } else if (lower.includes('glasses')) {
      replyContent =
        'Your reading glasses were last seen on the kitchen sideboard next to the fruit bowl.';
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: replyContent,
      timestamp: format(new Date(), 'h:mm a'),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    speak(replyContent);
    setInputValue('');
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speak('Voice input is not supported in this browser.');
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-on-background overflow-x-hidden pb-40">
      {/* Top App Bar — sticky */}
      <TopAppBar />

      {/* Scrollable chat area */}
      <main className="max-w-xl mx-auto px-container-margin pt-stack-gap pb-40 flex flex-col gap-stack-gap">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <AIMessage key={msg.id} message={msg} />
          ),
        )}

        {/* Suggestion chips */}
        <section aria-label="Common questions">
          <h2 className="font-label-lg text-label-lg text-on-surface-variant mb-4 px-1">
            Common Questions
          </h2>
          <div className="flex flex-wrap gap-unit">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="bg-surface-container-low border-2 border-outline-variant rounded-full px-5 py-3 hover:bg-surface-container-high transition-colors text-on-surface font-body-md text-body-md active:scale-95 duration-150 min-h-[48px]"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </main>

      {/* Fixed voice input bar — above bottom nav */}
      <div className="fixed bottom-[88px] left-0 right-0 px-container-margin z-40">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          {/* Text input area */}
          <div className="flex-grow bg-surface-container-highest rounded-full h-14 px-6 flex items-center shadow-lg border border-outline-variant/30">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask me anything..."
              aria-label="Ask the assistant a question"
              className="w-full bg-transparent text-on-surface font-body-lg placeholder:text-on-surface-variant outline-none text-body-lg-mobile"
            />
          </div>

          {/* Mic button */}
          <button
            onClick={handleMicClick}
            aria-label={isListening ? 'Listening… tap to stop' : 'Start voice input'}
            aria-pressed={isListening}
            className={[
              'w-16 h-16 rounded-full flex items-center justify-center shadow-xl',
              'transition-all active:scale-95 duration-150',
              isListening
                ? 'bg-secondary text-on-secondary animate-pulse'
                : 'bg-primary text-on-primary hover:bg-primary-container',
            ].join(' ')}
          >
            <Icon
              name="mic"
              filled={isListening}
              size={28}
            />
          </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNav currentPath="/assistant" />
    </div>
  );
}
