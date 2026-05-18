import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Mapa from "../components/Mapa";
import PanelRuta from "../components/PanelRuta";
import { getRutas } from "../services/api";
import "./Home.css";

export default function Home() {
    const [ruta, setRuta] = useState(null);
    const [error, setError] = useState("");
    const [paradaActiva, setParadaActiva] = useState(null);
    const [panelColapsado, setPanelColapsado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const usuario = localStorage.getItem("usuario");
        if (!usuario) { navigate("/"); return; }
        getRutas()
            .then(res => { if (res.data.length > 0) setRuta(res.data[0]); })
            .catch(() => setError("No se pudo conectar con el servidor"));
    }, [navigate]);

    return (
        <div className="home">
            <Navbar />
            <div className="home-body">
                <PanelRuta
                    ruta={ruta}
                    onParadaClick={(p, i) => setParadaActiva({ parada: p, index: i })}
                    colapsado={panelColapsado}
                    setColapsado={setPanelColapsado}
                />
                <div className="home-map">
                    {error && <div className="home-error">{error}</div>}
                    {ruta && (
                        <Mapa
                            ruta={ruta}
                            paradaActivaExterna={paradaActiva}
                            onParadaClick={(p, i) => setParadaActiva({ parada: p, index: i })}
                            panelColapsado={panelColapsado}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}