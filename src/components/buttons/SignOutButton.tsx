import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../context/auth/firebase";
import { useAuth } from "../../context/auth/auth";

export default function SignOutButton() {
  const { setUser, checkUserFunc } = useAuth();

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser("notLoggedIn");
      localStorage.setItem("user", "");
      checkUserFunc();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return <button onClick={signOut}>Sign Out</button>;
}
