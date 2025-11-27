import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
    setSent(true);
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card p-4 rounded shadow-lg" style={{ width: "400px" }}>
        
        {!sent ? (
          <>
            <h2 className="text-center mb-4 text-success fw-bold">
              Forgot Password
            </h2>
            <p className="text-muted mb-3">
              Enter your email and we will send you a verification code.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn btn-success w-100">Send Code</button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-success mb-3">✔ Code Sent!</h3>
            <p className="text-light">
              We have sent a verification code to <strong>{email}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
