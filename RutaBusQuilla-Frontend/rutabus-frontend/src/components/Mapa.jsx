import { useEffect, useState, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { crearResena, getResenasPorParada, getObstrucciones } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, ZoomControl } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconInicio = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const iconFin = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const iconUsuario = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const iconAlerta = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

async function obtenerRutaPorCalles(paradas) {
    const coords = paradas.map(p => `${p.longitud},${p.latitud}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.length > 0)
            return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    } catch (e) { console.error("Error OSRM:", e); }
    return paradas.map(p => [p.latitud, p.longitud]);
}

async function calcularDistancia(origen, destino) {
    const url = `https://router.project-osrm.org/route/v1/foot/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?overview=false`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.length > 0) {
            const km = (data.routes[0].distance / 1000).toFixed(1);
            return { km };
        }
    } catch (e) { console.error(e); }
    return null;
}

function VolarAParada({ parada }) {
    const map = useMap();
    useEffect(() => {
        if (parada) map.flyTo([parada.latitud, parada.longitud], 16, { duration: 1 });
    }, [parada]);
    return null;
}

function PanelDerecho({ parada, index, total, ubicacionUsuario, obstrucciones, onCerrar }) {
    const [resenas, setResenas] = useState([]);
    const [texto, setTexto] = useState("");
    const [calificacion, setCalificacion] = useState(5);
    const [enviando, setEnviando] = useState(false);
    const [distancia, setDistancia] = useState(null);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const reportesParada = obstrucciones.filter(o =>
        o.activa && o.nombreParada === parada.nombre
    );

    useEffect(() => {
        getResenasPorParada(parada.id).then(res => setResenas(res.data));
        if (ubicacionUsuario) {
            calcularDistancia(ubicacionUsuario, [parada.latitud, parada.longitud])
                .then(setDistancia);
        }
    }, [parada]);

    useEffect(() => {
        if (ubicacionUsuario) {
            calcularDistancia(ubicacionUsuario, [parada.latitud, parada.longitud])
                .then(setDistancia);
        }
    }, [ubicacionUsuario]);

    const handleEnviar = async () => {
        if (!texto.trim()) return;
        setEnviando(true);
        try {
            const nueva = await crearResena({
                texto, calificacion,
                nombreUsuario: usuario.nombre || "Anónimo",
                paradaId: parada.id
            });
            setResenas(prev => [nueva.data, ...prev]);
            setTexto(""); setCalificacion(5);
        } catch (e) { console.error(e); }
        setEnviando(false);
    };

    return (
        <div style={{
            position: "absolute", top: 0, right: 0,
            width: 300, height: "100%",
            background: "rgba(15,27,45,0.97)",
            borderLeft: "2px solid #f5a623",
            zIndex: 1000, overflowY: "auto",
            fontFamily: "DM Sans, sans-serif",
            animation: "slideLeft 0.3s ease",
            display: "flex", flexDirection: "column"
        }}>
            <style>{`@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

            {/* Header */}
            <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                        <span style={{
                            background: "#f5a623", color: "#0f1b2d",
                            fontSize: "0.68rem", fontWeight: 700,
                            padding: "2px 8px", borderRadius: 20, letterSpacing: 1
                        }}>
                            PARADA {index + 1}{index === 0 ? " · INICIO" : index === total - 1 ? " · FINAL" : ""}
                        </span>
                        <h3 style={{ color: "#fff", fontSize: "0.95rem", marginTop: 8, fontWeight: 600, lineHeight: 1.3 }}>
                            {parada.nombre}
                        </h3>
                        {distancia && (
                            <p style={{ color: "#f5a623", fontSize: "0.8rem", marginTop: 4 }}>
                                🚶 {distancia.km} km desde tu ubicación
                            </p>
                        )}
                    </div>
                    <button onClick={onCerrar} style={{
                        background: "rgba(255,255,255,0.1)", border: "none",
                        color: "#fff", borderRadius: "50%", width: 28, height: 28,
                        cursor: "pointer", fontSize: "0.85rem", flexShrink: 0, marginLeft: 8
                    }}>✕</button>
                </div>
            </div>

            {/* Reportes */}
            {reportesParada.length > 0 && (
                <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <p style={{ color: "#ff6b6b", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                        🚧 Reportes activos ({reportesParada.length})
                    </p>
                    {reportesParada.map(r => (
                        <div key={r.id} style={{
                            background: "rgba(255,100,100,0.08)",
                            border: "1px solid rgba(255,100,100,0.25)",
                            borderRadius: 10, padding: "10px 12px", marginBottom: 8
                        }}>
                            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", lineHeight: 1.4 }}>
                                {r.descripcion}
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: 4 }}>
                                {new Date(r.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Reseñas */}
            <div style={{ padding: "14px 16px", flex: 1 }}>
                <p style={{ color: "#f5a623", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                    💬 Reseñas ({resenas.length})
                </p>

                {/* Formulario */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Calificación:</span>
                        {[1,2,3,4,5].map(n => (
                            <span key={n} onClick={() => setCalificacion(n)}
                                style={{ cursor: "pointer", fontSize: "1rem", opacity: n <= calificacion ? 1 : 0.3 }}>⭐</span>
                        ))}
                    </div>
                    <textarea value={texto} onChange={e => setTexto(e.target.value)}
                        placeholder="Escribe tu reseña..." rows={2}
                        style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", padding: "8px 10px", fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", resize: "none", outline: "none", boxSizing: "border-box" }} />
                    <button onClick={handleEnviar} disabled={enviando || !texto.trim()}
                        style={{ marginTop: 8, padding: "5px 14px", background: texto.trim() ? "#f5a623" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: texto.trim() ? "#0f1b2d" : "rgba(255,255,255,0.3)", fontWeight: 600, fontSize: "0.78rem", cursor: texto.trim() ? "pointer" : "default" }}>
                        {enviando ? "Enviando..." : "Publicar"}
                    </button>
                </div>

                {/* Lista reseñas */}
                {resenas.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", textAlign: "center" }}>Sin reseñas aún</p>
                ) : resenas.map(r => (
                    <div key={r.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ color: "#f5a623", fontSize: "0.78rem", fontWeight: 600 }}>{r.nombreUsuario}</span>
                            <span style={{ fontSize: "0.72rem" }}>{"⭐".repeat(r.calificacion)}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", lineHeight: 1.4 }}>{r.texto}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Mapa({ ruta, paradaActivaExterna, onParadaClick, panelColapsado }) {
    const [rutaCalles, setRutaCalles] = useState([]);
    const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
    const [paradaSeleccionada, setParadaSeleccionada] = useState(null);
    const [obstrucciones, setObstrucciones] = useState([]);

    useEffect(() => {
        const zoom = document.querySelector(".leaflet-top.leaflet-left");
        if (zoom) {
          zoom.style.transition = "margin-left 0.3s ease";
            zoom.style.marginLeft = panelColapsado ? "50px" : "340px";
        }
    }, [panelColapsado]);   

    useEffect(() => {
        if (!ruta?.paradas?.length) return;
        obtenerRutaPorCalles(ruta.paradas).then(setRutaCalles);
        getObstrucciones().then(res => setObstrucciones(res.data));
    }, [ruta]);

    useEffect(() => {
        if (paradaActivaExterna) setParadaSeleccionada(paradaActivaExterna);
    }, [paradaActivaExterna]);

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.watchPosition(
            pos => setUbicacionUsuario([pos.coords.latitude, pos.coords.longitude]),
            err => console.warn(err), { enableHighAccuracy: true }
        );
    }, []);

    if (!ruta?.paradas?.length) return null;

    const centro = ubicacionUsuario || [
        ruta.paradas[Math.floor(ruta.paradas.length / 2)].latitud,
        ruta.paradas[Math.floor(ruta.paradas.length / 2)].longitud
    ];

    const tieneReporte = (parada) =>
        obstrucciones.some(o => o.activa && o.nombreParada === parada.nombre);

    const handleClickParada = (parada, i) => {
        setParadaSeleccionada({ parada, index: i });
        if (onParadaClick) onParadaClick(parada, i);
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "calc(100vh - 60px)" }}>
            <MapContainer center={centro} zoom={13} style={{ width: "100%", height: "100%" }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <ZoomControl position="topleft" />

                {paradaSeleccionada && <VolarAParada parada={paradaSeleccionada.parada} />}

                {rutaCalles.length > 0 && (
                    <Polyline positions={rutaCalles} color="#f5a623" weight={5} opacity={0.9} />
                )}

                {ruta.paradas.map((parada, i) => (
                    <Marker
                        key={parada.id}
                        position={[parada.latitud, parada.longitud]}
                        icon={tieneReporte(parada) ? iconAlerta : i === 0 ? iconInicio : i === ruta.paradas.length - 1 ? iconFin : new L.Icon.Default()}
                        eventHandlers={{ click: () => handleClickParada(parada, i) }}
                    >
                        <Popup>
                            <div style={{ fontFamily: "DM Sans, sans-serif" }}>
                                <strong>{parada.nombre}</strong><br />
                                {tieneReporte(parada) && <span style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>🚧 Tiene reporte activo</span>}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {ubicacionUsuario && (
                    <>
                        <Marker position={ubicacionUsuario} icon={iconUsuario}>
                            <Popup><strong>📍 Tu ubicación</strong></Popup>
                        </Marker>
                        <Circle center={ubicacionUsuario} radius={150} color="#f5a623" fillColor="#f5a623" fillOpacity={0.15} />
                    </>
                )}
            </MapContainer>

            {paradaSeleccionada && (
                <PanelDerecho
                    parada={paradaSeleccionada.parada}
                    index={paradaSeleccionada.index}
                    total={ruta.paradas.length}
                    ubicacionUsuario={ubicacionUsuario}
                    obstrucciones={obstrucciones}
                    onCerrar={() => setParadaSeleccionada(null)}
                />
            )}
        </div>
    );
}