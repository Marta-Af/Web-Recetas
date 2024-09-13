import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!email) {
      formErrors.email = "El campo email es obligatorio.";
    }
    if (!password) {
      formErrors.password = "El campo contraseña es obligatorio.";
    }
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    // Lógica de inicio de sesión
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div className={`form-field ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              id="email"
              className={`login-input ${email ? "filled" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="floating-label">
              Email
            </label>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className={`form-field ${errors.password ? "error" : ""}`}>
            <input
              type="password"
              id="password"
              className={`login-input ${password ? "filled" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="floating-label">
              Contraseña
            </label>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
