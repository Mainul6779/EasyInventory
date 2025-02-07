import { createContext, useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase/firebase.config';

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password, name, photoURL) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newUser = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
        }).then(() => {
          setUser(newUser);
          setLoading(false);
          console.log(newUser);
        });
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const updatedUser = {
          ...userCredential.user,
          photoURL: userCredential.user.photoURL || '',
        };
        setUser(updatedUser);
        setLoading(false);
        return updatedUser;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleAuthProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        setUser(null);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      console.log('logged in user inside auth state observer', loggedUser);
      setUser(loggedUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? (
        <div className="flex justify-center items-center mt-5">
          <div className="w-16 h-16 border-4 border-t-4 border-green-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
