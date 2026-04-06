import React, { useState, useEffect } from 'react';
import { Radio, Clock } from 'lucide-react';
import { getCurrentProgram } from '@/data/scheduleData';
import { useNotifications } from '@/hooks/useNotifications';

const LiveBanner = () => {
  const [currentProgram, setCurrentProgram] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lastNotifiedProgram, setLastNotifiedProgram] = useState<string>('');
  const { showNotification, canNotify } = useNotifications();

  useEffect(() => {
    const updateCurrentProgram = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Africa/Lubumbashi' 
      }));
      
      const newProgram = getCurrentProgram();
      
      if (newProgram !== lastNotifiedProgram && canNotify && newProgram !== 'DETENTE') {
        showNotification({
          title: 'Nouveau programme sur RTCT',
          body: `${newProgram} vient de commencer`,
          tag: 'program-change',
          icon: '/src/assets/logo-rtct.png'
        });
        setLastNotifiedProgram(newProgram);
      }
      
      setCurrentProgram(newProgram);
    };

    updateCurrentProgram();
    const interval = setInterval(updateCurrentProgram, 60000);
    return () => clearInterval(interval);
  }, [canNotify, showNotification, lastNotifiedProgram]);

  return (
    <div className="bg-gradient-to-r from-rtct-green-dark to-rtct-green-light text-white py-1 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Radio className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            <span className="text-xs sm:text-sm">88.1 MHz</span>
          </div>
          <div className="hidden sm:block text-sm sm:text-lg font-bold">
            {currentProgram}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{currentTime}</span>
          </div>
        </div>
        <div className="sm:hidden text-center">
          <div className="text-sm font-bold truncate">{currentProgram}</div>
        </div>
      </div>
    </div>
  );
};

export default LiveBanner;
