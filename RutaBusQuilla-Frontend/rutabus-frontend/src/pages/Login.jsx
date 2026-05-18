import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsuarios } from "../services/api";
import "./Auth.css";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await getUsuarios();
            const usuario = res.data.find(
                u => u.correo === correo && u.contrasena === contrasena
            );
            if (usuario) {
                localStorage.setItem("usuario", JSON.stringify(usuario));
                if (usuario.rol === "ADMINISTRADOR") {
                    navigate("/admin");
                } else {
                    navigate("/home");
            }
            } else {
                setError("Correo o contraseña incorrectos");
            }
        } catch {
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">🚌</div>
                <h1 className="auth-title">RutaBusQuilla</h1>
                <p className="auth-sub">Barranquilla en movimiento</p>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Correo</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            placeholder="tucorreo@email.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={e => setContrasena(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-btn">Ingresar</button>
                </form>
                <p className="auth-link">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
}