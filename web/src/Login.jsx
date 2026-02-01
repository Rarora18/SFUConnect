import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      setError("Please verify your email before logging in.");
      return;
    }

    navigate("/");
  } catch (err) {
    switch (err.code) {
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;

      case "auth/user-not-found":
        setError("No account found with that email.");
        break;

      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;

      case "auth/too-many-requests":
        setError("Too many failed attempts. Please try again later.");
        break;

      default:
        setError("Login failed. Please check your credentials.");
    }
  }
};



  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
      )}
    </div>
  );
}
