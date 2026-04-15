import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await getWishlist();
      setWishlistItems(data.wishlist || []);
    } catch (error) {
      console.error('Wishlist fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      await apiAddToWishlist(product.id);
      setWishlistItems(prev => [...prev, product]);
      toast.success('Added to Wishlist!', {
        icon: '❤️',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await apiRemoveFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.id !== productId && item.product_id !== productId));
      toast.success('Removed from Wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item.id === productId || item.product_id === productId));
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
