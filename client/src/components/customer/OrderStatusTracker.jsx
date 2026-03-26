/**
 * Animated vertical stepper for order status tracking
 */
export const OrderStatusTracker = ({ order }) => {
  const steps = [
    { _id: 'pending', label: 'Placed', icon: '📋' },
    { _id: 'cooking', label: 'Cooking', icon: '🔥' },
    { _id: 'ready', label: 'Ready', icon: '🍽️' },
    { _id: 'served', label: 'Served', icon: '😊' }
  ];

  const getStepTimestamp = (stepId) => {
    const history = order.statusHistory.find(h => h.status === stepId);
    if (!history) return null;
    const date = new Date(history.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentStepIndex = steps.findIndex(s => s._id === order.status);
  const isComplete = (stepIndex) => stepIndex <= currentStepIndex;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step._id} className="flex gap-4">
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${isComplete(index)
                    ? 'bg-green-500 text-white scale-110'
                    : index === currentStepIndex
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {isComplete(index) ? '✓' : step.icon}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-1 h-8 mt-1 ${isComplete(index + 1) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                ></div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-gray-900">{step.label}</h3>
              {getStepTimestamp(step._id) && (
                <p className="text-sm text-gray-500">{getStepTimestamp(step._id)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
