import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getRutas, getResenasPorParada, crearObstruccion, getObstrucciones, actualizarObstruccion, eliminarObstruccion } from "../services/api";

export default function Admin() {
    const [rutas, setRutas] = useState([]);
    const [rutaSeleccionada, setRutaSeleccionada] = useState("");
    const [paradaSeleccionada, setParadaSeleccionada] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [resenasPorParada, setResenasPorParada] = useState({});
    const [paradaResenasAbierta, setParadaResenasAbierta] = useState(null);
    const [obstrucciones, setObstrucciones] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [textoEdicion, setTextoEdicion] = useState("");
    const navigate = useNavigate();

    const rutaActual = rutas.find(r => r.nombre === rutaSeleccionada);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (usuario.rol !== "ADMINISTRADOR") { navigate("/"); return; }
        getRutas().then(res => {
            setRutas(res.data);
            if (res.data.length > 0) setRutaSeleccionada(res.data[0].nombre);
        });
        getObstrucciones().then(res => setObstrucciones(res.data));
    }, [navigate]);

    const cargarResenas = async (parada) => {
        if (paradaResenasAbierta?.id === parada.id) { setParadaResenasAbierta(null); return; }
        setParadaResenasAbierta(parada);
        if (!resenasPorParada[parada.id]) {
            const res = await getResenasPorParada(parada.id);
            setResenasPorParada(prev => ({ ...prev, [parada.id]: res.data }));
        }
    };

    const reportarObstruccion = async () => {
        if (!rutaSeleccionada || !paradaSeleccionada || !descripcion) return;
        try {
            const res = await crearObstruccion({
                nombreRuta: rutaSeleccionada,
                nombreParada: paradaSeleccionada,
                descripcion
            });
            setObstrucciones(prev => [res.data, ...prev]);
            setMensaje("✅ Obstrucción reportada");
            setDescripcion(""); setParadaSeleccionada("");
            setTimeout(() => setMensaje(""), 3000);
        } catch { setMensaje("❌ Error al reportar"); }
    };

    const handleEliminar = async (id) => {
        if (!confirm("¿Eliminar este reporte?")) return;
        await eliminarObstruccion(id);
        setObstrucciones(prev => prev.filter(o => o.id !== id));
    };

    const handleActualizar = async (id) => {
        const res = await actualizarObstruccion(id, {
            descripcion: textoEdicion,
            activa: obstrucciones.find(o => o.id === id)?.activa
        });
        setObstrucciones(prev => prev.map(o => o.id === id ? res.data : o));
        setEditandoId(null);
    };

    const toggleActiva = async (obstruccion) => {
        const res = await actualizarObstruccion(obstruccion.id, {
            descripcion: obstruccion.descripcion,
            activa: !obstruccion.activa
        });
        setObstrucciones(prev => prev.map(o => o.id === obstruccion.id ? res.data : o));
    };

    const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 16, padding: 28, marginBottom: 24 };
    const label = { color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 };
    const selectStyle = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", marginBottom: 14, outline: "none" };

    return (
        <div style={{ minHeight: "100vh", background: "#0f1b2d", fontFamily: "DM Sans, sans-serif", overflowY: "auto" }}>
            <Navbar />
            <div style={{ padding: "80px 40px 40px", maxWidth: 760, margin: "0 auto" }}>
                <h1 style={{ color: "#f5a623", fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", letterSpacing: 2, marginBottom: 8 }}>
                    Panel Administrador
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>Gestión de rutas y obstrucciones — RutaBusQuilla</p>

                {/* Reportar obstrucción */}
                <div style={card}>
                    <h2 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: 20 }}>🚧 Reportar Obstrucción</h2>
                    <label style={label}>Ruta</label>
                    <select value={rutaSeleccionada} onChange={e => { setRutaSeleccionada(e.target.value); setParadaSeleccionada(""); }} style={selectStyle}>
                        {rutas.map(r => <option key={r.id} value={r.nombre} style={{ background: "#0f1b2d" }}>{r.nombre}</option>)}
                    </select>
                    <label style={label}>Parada afectada</label>
                    <select value={paradaSeleccionada} onChange={e => setParadaSeleccionada(e.target.value)} style={selectStyle}>
                        <option value="" style={{ background: "#0f1b2d" }}>Selecciona una parada</option>
                        {rutaActual?.paradas?.map((p, i) => (
                            <option key={p.id} value={p.nombre} style={{ background: "#0f1b2d" }}>{i + 1}. {p.nombre}</option>
                        ))}
                    </select>
                    <label style={label}>Descripción</label>
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
                        placeholder="Ej: Accidente en Av. Cordialidad con Calle 53..." rows={3}
                        style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
                    {mensaje && <p style={{ color: mensaje.includes("✅") ? "#51cf66" : "#ff6b6b", fontSize: "0.85rem", marginBottom: 12 }}>{mensaje}</p>}
                    <button onClick={reportarObstruccion} style={{ padding: "10px 24px", background: "#f5a623", border: "none", borderRadius: 10, color: "#0f1b2d", fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem", letterSpacing: 1, cursor: "pointer" }}>
                        Reportar
                    </button>
                </div>

                {/* Histórico de obstrucciones */}
                <div style={{ ...card, border: "1px solid rgba(255,100,100,0.2)" }}>
                    <h2 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: 16 }}>📋 Histórico de Reportes ({obstrucciones.length})</h2>
                    {obstrucciones.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>Sin reportes aún</p>
                    ) : obstrucciones.map(o => (
                        <div key={o.id} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 10, border: `1px solid ${o.activa ? "rgba(255,100,100,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <div>
                                    <span style={{ background: o.activa ? "rgba(255,100,100,0.2)" : "rgba(255,255,255,0.1)", color: o.activa ? "#ff6b6b" : "rgba(255,255,255,0.4)", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                                        {o.activa ? "● ACTIVA" : "● RESUELTA"}
                                    </span>
                                    <p style={{ color: "#f5a623", fontWeight: 600, fontSize: "0.85rem", marginTop: 6 }}>{o.nombreRuta}</p>
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>📍 {o.nombreParada}</p>
                                </div>
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>
                                    {new Date(o.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            {editandoId === o.id ? (
                                <div>
                                    <textarea value={textoEdicion} onChange={e => setTextoEdicion(e.target.value)} rows={2}
                                        style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(245,166,35,0.4)", borderRadius: 8, color: "#fff", fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => handleActualizar(o.id)} style={{ padding: "5px 14px", background: "#f5a623", border: "none", borderRadius: 8, color: "#0f1b2d", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>Guardar</button>
                                        <button onClick={() => setEditandoId(null)} style={{ padding: "5px 14px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", fontSize: "0.8rem", cursor: "pointer" }}>Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: 10, lineHeight: 1.4 }}>{o.descripcion}</p>
                            )}

                            {editandoId !== o.id && (
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                    <button onClick={() => { setEditandoId(o.id); setTextoEdicion(o.descripcion); }}
                                        style={{ padding: "4px 12px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 8, color: "#f5a623", fontSize: "0.78rem", cursor: "pointer" }}>
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => toggleActiva(o)}
                                        style={{ padding: "4px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", cursor: "pointer" }}>
                                        {o.activa ? "✅ Marcar resuelta" : "🔄 Reactivar"}
                                    </button>
                                    <button onClick={() => handleEliminar(o.id)}
                                        style={{ padding: "4px 12px", background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", borderRadius: 8, color: "#ff6b6b", fontSize: "0.78rem", cursor: "pointer" }}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Reseñas por parada */}
                <div style={{ ...card, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h2 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: 16 }}>💬 Reseñas por parada</h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginBottom: 20 }}>Haz clic en una parada para ver sus reseñas</p>
                    {rutaActual?.paradas?.map((p, i) => (
                        <div key={p.id} style={{ marginBottom: 8 }}>
                            <div onClick={() => cargarResenas(p)} style={{ padding: "12px 16px", background: paradaResenasAbierta?.id === p.id ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.04)", borderRadius: 10, cursor: "pointer", border: paradaResenasAbierta?.id === p.id ? "1px solid rgba(245,166,35,0.4)" : "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                                <span style={{ color: "#f5a623", fontWeight: 600, fontSize: "0.85rem" }}>{i + 1}. {p.nombre}</span>
                                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{paradaResenasAbierta?.id === p.id ? "▲ Cerrar" : "▼ Ver reseñas"}</span>
                            </div>
                            {paradaResenasAbierta?.id === p.id && (
                                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "0 0 10px 10px", padding: "12px 16px", border: "1px solid rgba(245,166,35,0.2)", borderTop: "none" }}>
                                    {!resenasPorParada[p.id] ? (
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>Cargando...</p>
                                    ) : resenasPorParada[p.id].length === 0 ? (
                                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>Sin reseñas aún</p>
                                    ) : resenasPorParada[p.id].map(r => (
                                        <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ color: "#f5a623", fontSize: "0.82rem", fontWeight: 600 }}>{r.nombreUsuario}</span>
                                                <span style={{ fontSize: "0.78rem" }}>{"⭐".repeat(r.calificacion)}</span>
                                            </div>
                                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", lineHeight: 1.4 }}>{r.texto}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}