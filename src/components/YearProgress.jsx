import React, { useState, useEffect } from 'react';
import { Moon, Sun, Share2, RefreshCcw } from 'lucide-react';

const YearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize theme based on user's system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: '2025 Progress Tracker',
        text: `Current Year Progress: ${progress.toFixed(2)}%\nDays Passed: ${daysPassed}\nDays Left: ${daysLeft}`,
        url: window.location.href
      };
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div 
        className={`w-full max-w-md rounded-lg p-6 space-y-6 transition-all duration-300 transform hover:scale-102 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            2024 Progress
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              }`}
              title="Share Progress"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={refreshPage}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              }`}
              title="Refresh Data"
            >
              <RefreshCcw size={20} />
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-emerald-400' 
                  : 'hover:bg-gray-200 text-emerald-600'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate(currentTime)}
            </div>
          </div>
          <div className={`rounded-lg p-4 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className={`overflow-hidden h-3 text-xs flex rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              style={{ width: `${progress}%` }}
              className={`animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 ${
                isHovering ? 'animate-pulse' : ''
              }`}
            />
          </div>
          <div className="text-center mt-4 mb-2">
            <div className={`inline-block rounded-lg px-6 py-3 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <span className="text-2xl font-mono font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {progress.toFixed(6)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Passed</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{daysPassed}</div>
          </div>
          <div className={`rounded-lg p-4 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Left</div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{daysLeft}</div>
          </div>
        </div>

        <div className={`text-center text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Counting down every second of 2024
        </div>
      </div>
    </div>
  );
};

export default YearProgress;
