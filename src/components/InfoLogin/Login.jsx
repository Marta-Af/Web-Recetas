// import React, { useState } from "react";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//   };

//   return (
//     <div className="login-container">
//       <h2 className="login-title">Iniciar Sesión</h2>
//       <form className="login-form" onSubmit={handleSubmit}>
//         <label htmlFor="email" className="login-label">
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           className="login-input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <label htmlFor="password" className="login-label">
//           Contraseña
//         </label>
//         <input
//           type="password"
//           id="password"
//           className="login-input"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="login-button">
//           Iniciar Sesión
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Login;
