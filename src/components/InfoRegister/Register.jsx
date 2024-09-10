const Register = () => {
  return (
    <div className="div_reg">
      <div className="div_form">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Registro</h2>
          <div className="fields">
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <button className="form__btn" type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
