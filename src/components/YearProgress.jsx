import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

const YearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const progressInterval = setInterval(() => {
      const now = new Date();
      const start = new Date('2024-01-01T00:00:00');
      const end = new Date('2025-01-01T00:00:00');
      
      const total = end - start;
      const current = now - start;
      const percentage = (current / total) * 100;
      
      const oneDay = 24 * 60 * 60 * 1000;
      const passedDays = Math.floor((now - start) / oneDay);
      const leftDays = Math.floor((end - now) / oneDay);
      
      setProgress(Math.max(0, Math.min(100, percentage)));
      setDaysLeft(leftDays);
      setDaysPassed(passedDays);
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            2025 Progress
          </h1>
          <Moon className="text-emerald-400" size={24} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">
              {formatDate(currentTime)}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="overflow-hidden h-3 text-xs flex rounded-lg bg-gray-700">
            <div
              style={{ width: `${progress}%` }}
              className="animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
            />
          </div>
          <div className="text-center mt-4 mb-2">
            <div className="inline-block bg-gray-900 rounded-lg px-6 py-3">
              <span className="text-2xl font-mono font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {progress.toFixed(6)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Days Passed</div>
            <div className="text-2xl font-bold text-white">{daysPassed}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Days Left</div>
            <div className="text-2xl font-bold text-white">{daysLeft}</div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          Counting down every second of 2025
        </div>
      </div>
    </div>
  );
};

export default YearProgress;