import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/api";
import "./Auth.css";

export default function Registro() {
    const [form, setForm] = useState({
        nombre: "", direccion: "", correo: "",
        telefono: "", contrasena: "", rol: "USUARIO"
    });
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await registrarUsuario(form);
            setExito(true);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data || "Error al registrar");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">🚌</div>
                <h1 className="auth-title">Crear cuenta</h1>
                <p className="auth-sub">Únete a RutaBusQuilla</p>
                {exito ? (
                    <div className="auth-success">
                        ✅ Registro exitoso. Redirigiendo al login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {[
                            { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
                            { name: "direccion", label: "Dirección", type: "text", placeholder: "Tu dirección" },
                            { name: "correo", label: "Correo", type: "email", placeholder: "tucorreo@email.com" },
                            { name: "telefono", label: "Teléfono", type: "tel", placeholder: "300 123 4567" },
                            { name: "contrasena", label: "Contraseña", type: "password", placeholder: "••••••••" },
                        ].map(field => (
                            <div className="form-group" key={field.name}>
                                <label>{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required
                                />
                            </div>
                        ))}
                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit" className="auth-btn">Registrarse</button>
                    </form>
                )}
                <p className="auth-link">
                    ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}