import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar la contraseña

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Lógica de registro
  };

  return (
    <div className="div_reg">
      <div className="div_form">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Registro</h2>

          {/* Campo de nombre */}
          <div className={`form-field ${errors.name ? "error" : ""}`}>
            <input
              type="text"
              id="name"
              className={`register-input ${name ? "filled" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name" className="floating-label">
              Nombre
            </label>
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* Campo de email */}
          <div className={`form-field ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              id="email"
              className={`register-input ${email ? "filled" : ""}`}
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
              type={showPassword ? "text" : "password"} // Control para mostrar u ocultar contraseña
              id="password"
              className={`register-input ${password ? "filled" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="floating-label">
              Contraseña
            </label>
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"} {/* Icono de ojo */}
            </span>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Campo de confirmar contraseña */}
          <div
            className={`form-field ${errors.confirmPassword ? "error" : ""}`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"} // Control para mostrar u ocultar confirmación
              id="confirmPassword"
              className={`register-input ${confirmPassword ? "filled" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword" className="floating-label">
              Confirmar Contraseña
            </label>
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"} {/* Icono de ojo */}
            </span>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button className="form__btn" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
