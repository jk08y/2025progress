import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const YearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const progressInterval = setInterval(() => {
      const now = new Date();
      const start = new Date('2025-01-01T00:00:00');
      const end = new Date('2026-01-01T00:00:00');

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md rounded-lg p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            2025 Progress
          </h1>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="text-emerald-400" size={24} />
            ) : (
              <Moon className="text-emerald-400" size={24} />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate(currentTime)}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className={`overflow-hidden h-3 text-xs flex rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              style={{ width: `${progress}%` }}
              className={`animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500`}
            />
          </div>
          <div className="text-center mt-4 mb-2">
            <div className={`inline-block rounded-lg px-6 py-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <span className="text-2xl font-mono font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {progress.toFixed(6)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Passed</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{daysPassed}</div>
          </div>
          <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Left</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{daysLeft}</div>
          </div>
        </div>

        <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Counting down every second of 2025
        </div>
      </div>
    </div>
  );
};

export default YearProgress;