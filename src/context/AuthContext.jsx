import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import products from '../data/products';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const fetchRole = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role || 'user');
        } else {
          setRole('user');
        }
      } catch {
        setRole('user');
      }
    };
    fetchRole();
    const fetchWishlist = async () => {
      try {
        const ref = doc(db, 'wishlists', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setWishlist(snap.data().items || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        (async () => {
          try {
            const ref = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              setRole(snap.data().role || 'user');
            } else {
              setRole('user');
            }
          } catch {
            setRole('user');
          }
        })();
      } else {
        setRole('user');
      }
    });
    return () => unsubscribe();
  }, []);

  const register = async ({ email, password, firstName, lastName, role = 'user' }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: `${firstName} ${lastName}`
      });
      await setDoc(doc(db, 'users', res.user.uid), {
        firstName,
        lastName,
        email,
        role
      }, { merge: true });
      setUser({ ...res.user, displayName: `${firstName} ${lastName}` });
      setRole(role);
      toast.success('Account created!');
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
      return { success: true };
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setWishlist([]);
      toast.success('Logged out!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    if (isInWishlist(product.id)) {
      toast.error('Product already in wishlist');
      return;
    }
    try {
      const ref = doc(db, 'wishlists', user.uid);
      await setDoc(ref, { items: arrayUnion(product) }, { merge: true });
      setWishlist((prev) => [...prev, product]);
      toast.success('Added to wishlist! ❤️');
    } catch (err) {
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const ref = doc(db, 'wishlists', user.uid);
      const product = wishlist.find((item) => item.id === productId);
      if (!product) return;
      await updateDoc(ref, { items: arrayRemove(product) });
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const getRecommendations = () => {
    if (wishlist && wishlist.length > 0) {
      const wishlistCategories = new Set(wishlist.map(item => item.category));
      const wishlistBrands = new Set(wishlist.map(item => item.brand));
      const wishlistIds = new Set(wishlist.map(item => item.id));
      const recs = products.filter(
        p =>
          (!wishlistIds.has(p.id)) &&
          (wishlistCategories.has(p.category) || wishlistBrands.has(p.brand))
      );
      if (recs.length < 4) {
        const trending = products
          .filter(p => !wishlistIds.has(p.id))
          .sort((a, b) => b.reviews - a.reviews)
          .slice(0, 4 - recs.length);
        return [...recs.slice(0, 4), ...trending];
      }
      return recs.slice(0, 4);
    } else {
      const trending = products
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 4);
      const newProducts = products.filter(p => p.isNew).slice(0, 4);
      return [...newProducts, ...trending].slice(0, 4);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        signInWithGoogle,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getRecommendations,
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 