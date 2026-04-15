import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      if (!action.payload) return state;
      return {
        ...state,
        items: action.payload.items || [],
        summary: action.payload.summary || { subtotal: 0, shipping: 0, total: 0, totalItems: 0 },
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    summary: { subtotal: 0, shipping: 0, total: 0, totalItems: 0 },
    loading: false,
    error: null,
  });

  const fetchCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await getCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await apiAddToCart(productId, quantity);
      toast.success('Added to cart!');
      // Update state with returned data if available
      if (data.items) {
        dispatch({ type: 'SET_CART', payload: data });
      } else {
        await fetchCart();
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      return false;
    }
  };

  const updateItem = async (cartId, quantity) => {
    // Optimistic UI update
    const previousState = { ...state };
    const updatedItems = state.items.map(item => 
      item.cart_id === cartId ? { ...item, quantity } : item
    );
    
    // Calculate new summary optimistically
    const subtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = subtotal > 499 || subtotal === 0 ? 0 : 40;
    
    dispatch({ 
      type: 'SET_CART', 
      payload: { 
        items: updatedItems, 
        summary: { 
          subtotal, 
          totalItems, 
          shipping, 
          total: subtotal + shipping 
        } 
      } 
    });

    try {
      const { data } = await updateCartItem(cartId, quantity);
      // Sync with server response
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      toast.error('Failed to update quantity');
      // Rollback on error
      dispatch({ type: 'SET_CART', payload: previousState });
    }
  };

  const removeItem = async (cartId) => {
    // Optimistic UI update
    const previousState = { ...state };
    const updatedItems = state.items.filter(item => item.cart_id !== cartId);
    
    // Calculate new summary optimistically
    const subtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = subtotal > 499 || subtotal === 0 ? 0 : 40;

    dispatch({ 
      type: 'SET_CART', 
      payload: { 
        items: updatedItems, 
        summary: { 
          subtotal, 
          totalItems, 
          shipping, 
          total: subtotal + shipping 
        } 
      } 
    });

    try {
      const { data } = await removeCartItem(cartId);
      toast.success('Item removed from cart');
      // Sync with server response
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      toast.error('Failed to remove item');
      // Rollback on error
      dispatch({ type: 'SET_CART', payload: previousState });
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart();
      await fetchCart();
    } catch (error) {
      console.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
