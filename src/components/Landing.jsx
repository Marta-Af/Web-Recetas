import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      <div className="container-landing">
        {/* <img src={Logo} alt="Mis recetas" title="Logo" /> */}
        <h1>Todas tus recetas favoritas en un solo lugar</h1>
        <h3>Añade, busca facilmente, consulta y edita tu recetas favoritas</h3>

        <Link to="/Login" className="nav-link">
          Login
        </Link>
      </div>
    </>
  );
}
export default Landing;
