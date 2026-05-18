import "./PanelRuta.css";

export default function PanelRuta({ ruta, onParadaClick, colapsado, setColapsado }) {
    if (!ruta) return null;

    return (
        <>
            {/* Botón hamburguesa */}
            <button
                onClick={() => setColapsado(!colapsado)}
                style={{
                    position: "absolute",
                    top: 10,
                    left: colapsado ? 10 : 330,
                    zIndex: 1100,
                    background: "#0f1b2d",
                    border: "1px solid rgba(245,166,35,0.4)",
                    borderRadius: 8, width: 36, height: 36,
                    cursor: "pointer", color: "#f5a623",
                    fontSize: "1.1rem", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    transition: "left 0.3s ease",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.4)"
                }}
            >
                {colapsado ? "☰" : "✕"}
            </button>

            {/* Panel */}
            <div className="panel" style={{
                transform: colapsado ? "translateX(-100%)" : "translateX(0)",
                transition: "transform 0.3s ease",
                pointerEvents: colapsado ? "none" : "auto"
            }}>
                <div className="panel-header">
                    <span className="panel-badge">SODIS</span>
                    <h2 className="panel-title">{ruta.nombre}</h2>
                    <p className="panel-desc">{ruta.descripcion}</p>
                </div>
                <div className="panel-section">
                    <h3 className="panel-section-title">
                        📍 Paradas ({ruta.paradas?.length || 0})
                    </h3>
                    <div className="panel-paradas">
                        {ruta.paradas?.map((parada, i) => (
                            <div
                                className="parada-item"
                                key={parada.id}
                                onClick={() => onParadaClick && onParadaClick(parada, i)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="parada-num">{i + 1}</div>
                                <div className="parada-info">
                                    <span className="parada-nombre">{parada.nombre}</span>
                                    <span className="parada-coords">
                                        {parada.latitud.toFixed(4)}, {parada.longitud.toFixed(4)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}