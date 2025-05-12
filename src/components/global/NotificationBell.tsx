// import { useState } from 'react';
// import { Bell, Settings, X } from 'lucide-react';

// export default function NotificationBell() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       message: "YOUR REPORT STATUS IS OUT!!",
//       time: "2 hours ago",
//       read: false
//     },
//     {
//       id: 2,
//       message: "GET READY THE INTERNSHIP CYCLE BEGINS TOMORROW!!!",
//       time: "Yesterday",
//       read: false
//     }
//   ]);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(notif => ({ ...notif, read: true })));
//   };

//   const unreadCount = notifications.filter(notif => !notif.read).length;

//   return (
//     <div className="relative font-sans">
//       {/* Bell Icon Button */}
//       <button 
//         onClick={toggleDropdown}
//         className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
//       >
//         <Bell className="w-6 h-6" />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden w-80 z-50" style={{ minWidth: '320px' }}>
//           {/* Header */}
//           <div className="flex items-center justify-between bg-red-400 text-white p-4">
//             <h3 className="text-lg font-semibold">Notifications</h3>
//             <Settings className="w-5 h-5 cursor-pointer" />
//           </div>

//           {/* Notification Items */}
//           <div className="max-h-96 overflow-y-auto">
//             {notifications.map((notification) => (
//               <div 
//                 key={notification.id} 
//                 className={`p-4 border-b border-gray-100 flex items-start hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
//               >
//                 <div className="flex-grow">
//                   <p className="font-medium text-gray-800">{notification.message}</p>
//                   <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
//                 </div>
//                 <div className="ml-2 flex-shrink-0">
//                   {!notification.read && (
//                     <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>


//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import './NotificationBell.css';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "YOUR REPORT STATUS IS OUT!!",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      message: "GET READY THE INTERNSHIP CYCLE BEGINS TOMORROW!!!",
      time: "Yesterday",
      read: false
    }
  ]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="notification-container">
      {/* Bell Icon Button */}
      <button 
        onClick={toggleDropdown}
        className="bell-button"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="dropdown">
          {/* Header */}
          <div className="dropdown-header">
            <h3 className="dropdown-title">Notifications</h3>
            <Settings className="settings-icon" size={20} />
          </div>

          {/* Notification Items */}
          <div className="notification-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">{notification.time}</p>
                </div>
                <div className="notification-indicator">
                  {!notification.read && (
                    <div className="unread-dot"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}