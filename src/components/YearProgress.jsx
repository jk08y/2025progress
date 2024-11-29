import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun, Share2, RefreshCcw, Calendar, Clock, Timer, Sparkles } from 'lucide-react';

// Custom hook for theme management
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  return { isDarkMode, toggleTheme };
};

// Custom hook for time and progress tracking
const useYearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    daysPassed: 0,
    daysLeft: 0,
    hoursLeft: 0,
    minutesLeft: 0,
    secondsLeft: 0,
    percentageComplete: 0
  });

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear() + 1, 0, 1);

      const total = end - start;
      const current = now - start;
      const percentage = (current / total) * 100;

      const oneDay = 24 * 60 * 60 * 1000;
      const daysPassed = Math.floor((now - start) / oneDay);
      const daysLeft = Math.floor((end - now) / oneDay);

      const hoursDiff = end - now;
      const hoursLeft = Math.floor(hoursDiff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((hoursDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((hoursDiff % (1000 * 60)) / 1000);

      setProgress(Math.max(0, Math.min(100, percentage)));
      setStats({
        daysPassed,
        daysLeft,
        hoursLeft,
        minutesLeft,
        secondsLeft,
        percentageComplete: percentage
      });
    };

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      calculateProgress();
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return { progress, currentTime, stats };
};

const YearProgress = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { progress, currentTime, stats } = useYearProgress();
  const [isHovering, setIsHovering] = useState(false);

  // Memoized formatting functions
  const formatDate = useMemo(() => 
    currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), 
    [currentTime]
  );

  const formatTime = useMemo(() => 
    currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }), 
    [currentTime]
  );

  // Share functionality with fallback
  const handleShare = useCallback(async () => {
    try {
      const shareData = {
        title: '2024 Progress Tracker',
        text: `Year Progress: ${progress.toFixed(2)}%\nDays Passed: ${stats.daysPassed}\nDays Left: ${stats.daysLeft}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without native share
        await navigator.clipboard.writeText(shareData.text);
        alert('Progress copied to clipboard!');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
      alert('Sharing or copying failed');
    }
  }, [progress, stats]);

  // Refresh page with better UX
  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 
      ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div 
        className={`w-full max-w-md rounded-2xl p-6 space-y-6 transition-all duration-300 transform 
          ${isDarkMode 
            ? 'bg-gray-800 shadow-2xl border border-gray-700' 
            : 'bg-white shadow-2xl border border-gray-200'
          } hover:scale-[1.02]`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header with Title and Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            2024 Progress
          </h1>
          
          <div className="flex gap-2">
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full transition-all group ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              }`}
              title="Share Progress"
            >
              <Share2 size={20} className="group-hover:animate-pulse" />
            </button>
            
            {/* Refresh Button */}
            <button 
              onClick={refreshPage}
              className={`p-2 rounded-full transition-all group ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-emerald-400' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-emerald-600'
              }`}
              title="Refresh Data"
            >
              <RefreshCcw size={20} className="group-hover:animate-spin" />
            </button>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all group ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-emerald-400' 
                  : 'hover:bg-gray-200 text-emerald-600'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun size={20} className="group-hover:rotate-180 transition-transform" />
              ) : (
                <Moon size={20} className="group-hover:rotate-180 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Date and Time Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-4 flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Calendar size={20} className="text-emerald-500" />
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate}
            </div>
          </div>
          <div className={`rounded-lg p-4 flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Clock size={20} className="text-cyan-500" />
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatTime}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-4">
          <div className={`overflow-hidden h-4 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              style={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 
                ${isHovering ? 'animate-pulse' : ''}`}
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

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 flex flex-col items-center transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Timer size={24} className="text-emerald-500 mb-2" />
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Passed</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.daysPassed}</div>
          </div>
          <div className={`rounded-lg p-4 flex flex-col items-center transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Sparkles size={24} className="text-cyan-500 mb-2" />
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Left</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.daysLeft}</div>
          </div>
          <div className={`rounded-lg p-4 flex flex-col items-center transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Clock size={24} className="text-purple-500 mb-2" />
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hrs Left</div>
            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.hoursLeft}</div>
          </div>
        </div>

        <div className={`text-center text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Capturing every moment of 2024 ✨
        </div>
      </div>
    </div>
  );
};

export default YearProgress;