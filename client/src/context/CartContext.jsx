import { createContext, useReducer, useEffect, useCallback } from 'react';

export const CartContext = createContext();

const STORAGE_KEY = 'cart_state';

const initialState = {
  items: [],
  specialInstructions: ''
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.menuItemId === action.payload.menuItemId
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.menuItemId === action.payload.menuItemId
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.menuItemId !== action.payload)
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(item =>
          item.menuItemId === action.payload.menuItemId
            ? { ...item, qty: Math.max(1, action.payload.qty) }
            : item
        )
      };
    case 'SET_INSTRUCTIONS':
      return {
        ...state,
        specialInstructions: action.payload
      };
    case 'CLEAR_CART':
      return initialState;
    case 'RESTORE_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to sessionStorage (cleared when tab closes)
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Restore cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        dispatch({
          type: 'RESTORE_CART',
          payload: JSON.parse(savedCart)
        });
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const addItem = useCallback((menuItemId, name, price, qty = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { menuItemId, name, price, qty, note: '' }
    });
  }, []);

  const updateNote = useCallback((menuItemId, note) => {
    dispatch({
      type: 'UPDATE_ITEM_NOTE',
      payload: { menuItemId, note }
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: menuItemId
    });
  }, []);

  const updateQty = useCallback((menuItemId, qty) => {
    dispatch({
      type: 'UPDATE_QTY',
      payload: { menuItemId, qty }
    });
  }, []);

  const setInstructions = useCallback((instructions) => {
    dispatch({
      type: 'SET_INSTRUCTIONS',
      payload: instructions
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getTotalAmount = () => {
    return cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.qty, 0);
  };

  const value = {
    cart,
    items: cart.items,
    specialInstructions: cart.specialInstructions,
    addItem,
    updateNote,
    removeItem,
    updateQty,
    setInstructions,
    clearCart,
    getTotalAmount,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

import { useContext } from 'react';
