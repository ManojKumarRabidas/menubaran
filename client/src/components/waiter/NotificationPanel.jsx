/**
 * Real-time notification panel for waiters
 */
export const NotificationPanel = ({ notifications = [] }) => {
  const getAlertStyle = (type) => {
    const styles = {
      order: 'bg-blue-50 border-blue-200 text-blue-900',
      ready: 'bg-green-50 border-green-200 text-green-900',
      bill: 'bg-red-50 border-red-200 text-red-900',
      water: 'bg-cyan-50 border-cyan-200 text-cyan-900'
    };
    return styles[type] || styles.order;
  };

  const getAlertIcon = (type) => {
    const icons = {
      order: '🍽️',
      ready: '✅',
      bill: '💳',
      water: '💧'
    };
    return icons[type] || '📢';
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif, idx) => (
        <div
          key={idx}
          className={`p-4 border-2 rounded-lg flex items-start gap-3 animate-slide-in ${getAlertStyle(
            notif.type
          )}`}
        >
          <span className="text-2xl flex-shrink-0">{getAlertIcon(notif.type)}</span>
          <div className="flex-1">
            <p className="font-semibold">{notif.message}</p>
            <p className="text-xs opacity-75">{notif.timestamp}</p>
          </div>
          <button
            onClick={notif.onDismiss}
            className="text-lg font-bold opacity-50 hover:opacity-100 transition"
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
