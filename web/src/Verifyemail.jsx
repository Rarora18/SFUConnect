import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import { applyActionCode } from "firebase/auth";

export default function VerifyEmail() {
  const [status, setStatus] = useState("loading");
  const hascalled = useRef(false);

  useEffect(() => {
    if (hascalled.current) return;

    hascalled.current = true;
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    console.log(oobCode);
    

    if (!oobCode) {
      setStatus("invalid");
      
      return;
    }
    
    
    applyActionCode(auth, oobCode)
      .then(() => console.log("firing code"))
      .then(() => setStatus("success"))
      .catch((e) => {setStatus("error")
        console.log("abc",e)

      });
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
