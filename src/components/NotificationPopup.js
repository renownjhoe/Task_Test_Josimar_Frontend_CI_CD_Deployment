import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import echo from '../utils/pusher';

Pusher.logToConsole = true;
window.Pusher = Pusher;

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    echo.channel('brts')
      .listen('.brt.created', (data) => {
console.log(data);
        setNotifications(prev => [
          { 
            id: Date.now(), 
            message: `New BRT Created: ${data.brt_code}`,
            type: 'success'
          }, 
          ...prev
        ]);
      })
      .listen('.brt.updated', (data) => {
        setNotifications(prev => [
          { 
            id: Date.now(),
            message: `BRT Updated: ${data.brt_code}`,
            type: 'info'
          }, 
          ...prev
        ]);
      })
      .listen('.brt.deleted', (data) => {
        setNotifications(prev => [
          { 
            id: Date.now(),
            message: `BRT Deleted: ${data.brt_code}`,
            type: 'error'
          }, 
          ...prev
        ]);
      });

    return () => {
      echo.disconnect();
    };
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-50 w-72">
      <div className="flex flex-col space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success' 
                ? 'bg-green-100 border-green-500 text-green-700' 
                : notification.type === 'error'
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-blue-100 border-blue-500 text-blue-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotifications(prev => 
                  prev.filter(n => n.id !== notification.id)
                )}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPopup;