import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { applyActionCode } from "firebase/auth";

export default function VerifyEmail() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");

    if (!oobCode) {
      setStatus("invalid");
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {status === "loading" && <h2>Verifying your email...</h2>}
      {status === "success" && <h2>Email Verified Successfully!</h2>}
      {status === "error" && <h2>Verification Failed</h2>}
      {status === "invalid" && <h2>Invalid Verification Link</h2>}
    </div>
  );
}
