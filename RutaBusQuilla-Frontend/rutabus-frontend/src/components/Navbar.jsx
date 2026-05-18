import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getObstrucciones, getUsuarios, getResenasPorParada, getRutas } from "../services/api";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const esAdmin = usuario.rol === "ADMINISTRADOR";
    const [abierto, setAbierto] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [vistas, setVistas] = useState(() => {
        const g = localStorage.getItem("notif_vistas");
        return g ? JSON.parse(g) : [];
    });

    const cargarNotificacionesUsuario = async () => {
        const res = await getObstrucciones();
        return res.data.map(o => ({
            id: `obs-${o.id}`,
            tipo: o.activa ? "🚧 Obstrucción activa" : "✅ Obstrucción resuelta",
            titulo: `📍 ${o.nombreParada}`,
            texto: o.descripcion,
            fecha: o.fecha,
            color: o.activa ? "#ff6b6b" : "rgba(255,255,255,0.3)",
            bg: o.activa ? "rgba(255,100,100,0.15)" : "rgba(255,255,255,0.05)"
        }));
    };

    const cargarNotificacionesAdmin = async () => {
        const notifs = [];

        const usuarios = await getUsuarios();
        usuarios.data.filter(u => u.rol === "USUARIO").forEach(u => {
            notifs.push({
                id: `user-${u.id}`,
                tipo: "👤 Nuevo usuario",
                titulo: u.nombre,
                texto: `Se registró con el correo ${u.correo}`,
                fecha: null,
                color: "#51cf66",
                bg: "rgba(81,207,102,0.15)"
            });
        });

        const rutas = await getRutas();
        for (const ruta of rutas.data) {
            for (const parada of ruta.paradas || []) {
                const res = await getResenasPorParada(parada.id);
                res.data.forEach(r => {
                    notifs.push({
                        id: `resena-${r.id}`,
                        tipo: "💬 Nueva reseña",
                        titulo: `${r.nombreUsuario} en ${parada.nombre}`,
                        texto: `${"⭐".repeat(r.calificacion)} — ${r.texto}`,
                        fecha: r.fecha,
                        color: "#f5a623",
                        bg: "rgba(245,166,35,0.1)"
                    });
                });
            }
        }

        return notifs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    };

    useEffect(() => {
        const cargar = () => {
            if (esAdmin) {
                cargarNotificacionesAdmin().then(setNotificaciones);
            } else {
                cargarNotificacionesUsuario().then(setNotificaciones);
            }
        };
        cargar();
        const intervalo = setInterval(cargar, 30000);
        return () => clearInterval(intervalo);
    }, []);

    const sinLeer = notificaciones.filter(n => !vistas.includes(n.id)).length;

    const marcarVistas = () => {
        const ids = notificaciones.map(n => n.id);
        const nuevas = [...new Set([...vistas, ...ids])];
        setVistas(nuevas);
        localStorage.setItem("notif_vistas", JSON.stringify(nuevas));
    };

    const handleCampana = () => {
        setAbierto(!abierto);
        if (!abierto) marcarVistas();
    };

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("notif_vistas");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-icon">🚌</span>
                <span className="navbar-title">RutaBusQuilla</span>
            </div>
            <div className="navbar-user">
                {/* Campanita */}
                <div style={{ position: "relative" }}>
                    <button onClick={handleCampana} style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "50%", width: 36, height: 36,
                        cursor: "pointer", fontSize: "1.1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative"
                    }}>
                        🔔
                        {sinLeer > 0 && (
                            <span style={{
                                position: "absolute", top: -4, right: -4,
                                background: "#ff6b6b", color: "#fff",
                                borderRadius: "50%", width: 18, height: 18,
                                fontSize: "0.65rem", fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                {sinLeer}
                            </span>
                        )}
                    </button>

                    {abierto && (
                        <div style={{
                            position: "absolute", top: 44, right: 0,
                            width: 340, maxHeight: 420, overflowY: "auto",
                            background: "#0f1b2d",
                            border: "1px solid rgba(245,166,35,0.3)",
                            borderRadius: 14, zIndex: 9999,
                            fontFamily: "DM Sans, sans-serif",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                        }}>
                            <div style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                position: "sticky", top: 0,
                                background: "#0f1b2d", zIndex: 1
                            }}>
                                <span style={{ color: "#f5a623", fontWeight: 600, fontSize: "0.85rem" }}>
                                    {esAdmin ? "📋 Actividad del sistema" : "🔔 Notificaciones"}
                                </span>
                                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                                    {notificaciones.length} total
                                </span>
                            </div>

                            {notificaciones.length === 0 ? (
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", textAlign: "center", padding: 24 }}>
                                    Sin notificaciones
                                </p>
                            ) : notificaciones.map(n => (
                                <div key={n.id} style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    background: !vistas.includes(n.id) ? "rgba(245,166,35,0.04)" : "transparent"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{
                                            fontSize: "0.68rem", fontWeight: 700,
                                            color: n.color, background: n.bg,
                                            padding: "1px 7px", borderRadius: 20
                                        }}>
                                            {n.tipo}
                                        </span>
                                        {n.fecha && (
                                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>
                                                {new Date(n.fecha).toLocaleDateString("es-CO", {
                                                    day: "2-digit", month: "short",
                                                    hour: "2-digit", minute: "2-digit"
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, marginBottom: 2 }}>
                                        {n.titulo}
                                    </p>
                                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", lineHeight: 1.4 }}>
                                        {n.texto}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <span className="navbar-name">👤 {usuario.nombre}</span>
                <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </nav>
    );
}