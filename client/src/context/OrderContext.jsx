import { createContext, useReducer, useCallback, useContext } from 'react';

export const OrderContext = createContext();

const initialState = {
  currentOrder: null,
  kitchenOrders: [],
  waiterOrders: [],
  filter: 'all' // all, pending, cooking, ready
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload
      };
    case 'UPDATE_ORDER_STATUS': {
      const updatedOrder = { ...state.currentOrder, status: action.payload };
      return {
        ...state,
        currentOrder: updatedOrder
      };
    }
    case 'SET_KITCHEN_ORDERS':
      return {
        ...state,
        kitchenOrders: action.payload
      };
    case 'ADD_KITCHEN_ORDER':
      return {
        ...state,
        kitchenOrders: [action.payload, ...state.kitchenOrders]
      };
    case 'UPDATE_KITCHEN_ORDER': {
      return {
        ...state,
        kitchenOrders: state.kitchenOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    }
    case 'SET_WAITER_ORDERS':
      return {
        ...state,
        waiterOrders: action.payload
      };
    case 'UPDATE_WAITER_ORDER': {
      return {
        ...state,
        waiterOrders: state.waiterOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    }
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const setCurrentOrder = useCallback((order) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  }, []);

  const updateOrderStatus = useCallback((newStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: newStatus });
  }, []);

  const setKitchenOrders = useCallback((orders) => {
    dispatch({ type: 'SET_KITCHEN_ORDERS', payload: orders });
  }, []);

  const addKitchenOrder = useCallback((order) => {
    dispatch({ type: 'ADD_KITCHEN_ORDER', payload: order });
  }, []);

  const updateKitchenOrder = useCallback((order) => {
    dispatch({ type: 'UPDATE_KITCHEN_ORDER', payload: order });
  }, []);

  const setWaiterOrders = useCallback((orders) => {
    dispatch({ type: 'SET_WAITER_ORDERS', payload: orders });
  }, []);

  const updateWaiterOrder = useCallback((order) => {
    dispatch({ type: 'UPDATE_WAITER_ORDER', payload: order });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const value = {
    ...state,
    setCurrentOrder,
    updateOrderStatus,
    setKitchenOrders,
    addKitchenOrder,
    updateKitchenOrder,
    setWaiterOrders,
    updateWaiterOrder,
    setFilter
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
