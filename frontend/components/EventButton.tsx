import { useState, useRef } from 'react';
import { apiClient } from '../lib/api';
import Image from 'next/image';

interface EventButtonProps {
  type: 'dirty_pants' | 'potty';
  userId: number;
  onEventLogged: () => void;
}

export default function EventButton({ type, userId, onEventLogged }: EventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setShowFeedback(true);

    try {
      // Play random sound
      if (audioRef.current) {
        const sounds = type === 'potty' 
          ? ['/sounds/success.mp3', '/sounds/success2.mp3']
          : ['/sounds/accident.mp3', '/sounds/accident2.mp3'];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        audioRef.current.src = randomSound;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          // Ignore audio play errors
        });
      }

      // Log event
      await apiClient.logEvent(userId, type);
      onEventLogged();

      // Hide feedback after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to log event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonConfig = () => {
    if (type === 'potty') {
      return {
        image: '/peppa_potty.png',
        text: 'potty!!!',
        className: 'btn-success',
        feedback: 'Great job! 🎉'
      };
    } else {
      return {
        image: '/peppa_accident.png',
        text: 'accident',
        className: 'btn-danger',
        feedback: 'It\'s okay! 💪'
      };
    }
  };

  const config = getButtonConfig();

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`${config.className} w-48 h-48 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-2 rounded-lg shadow-lg border-4 border-gray-300 hover:shadow-xl hover:scale-105 active:scale-95 active:shadow-md transform transition-all duration-150 ease-in-out`}
        >
          <div className="relative w-full h-full">
            <Image
              src={config.image}
              alt={config.text}
              fill
              className="object-contain"
              priority
            />
          </div>
        </button>

        {/* Audio element */}
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/success.mp3" type="audio/mpeg" />
        </audio>

        {/* Feedback overlay */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg animate-pulse">
            <div className="text-white text-center">
              <div className="relative w-16 h-16 mb-2 mx-auto">
                <Image
                  src={config.image}
                  alt={config.text}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-xl font-bold">{config.feedback}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Text underneath the button */}
      <div className="mt-3 text-center">
        <p className="text-lg font-semibold text-gray-700">{config.text}</p>
      </div>
    </div>
  );
} 