// src/Authentication.jsx
import { useState } from "react";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export default function Authentication() {
  const [username, setUsername] = useState("");   // ← ADDED
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    const allowedDomain = "sfu.ca";
    const domain = email.split("@")[1];

    if (domain !== allowedDomain) {
      alert(`Only ${allowedDomain} emails are allowed.`);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

       await sendEmailVerification(user, {
        url: "http://localhost:5173/verify",
        handleCodeInApp: true,
        });

        console.log("Reached Firestore write");

        // ✅ FIXED setDoc syntax
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
          createdAt: new Date()
        });

        alert("Account created! Check your email to verify your account.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Account</h2>

      {/* Username input */}
      <input 
        type="text" 
        placeholder="Username" 
        onChange={(e) => setUsername(e.target.value)}
      /><br /><br />

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

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
