package com.rutabus.rutabus_backend.strategy;

import java.util.List;
import java.util.stream.Collectors;

import com.rutabus.rutabus_backend.model.Ruta;

public class BusquedaPorUbicacion implements BusquedaStrategy {

    private static final double RADIO_KM = 2.0;

    @Override
    public List<Ruta> buscar(List<Ruta> rutas, String criterio) {
        String[] coords = criterio.split(",");
        double latitud = Double.parseDouble(coords[0].trim());
        double longitud = Double.parseDouble(coords[1].trim());

        return rutas.stream()
                .filter(r -> r.getParadas().stream()
                        .anyMatch(p -> calcularDistancia(p.getLatitud(), p.getLongitud(), latitud, longitud) <= RADIO_KM))
                .collect(Collectors.toList());
    }

    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int RADIO_TIERRA = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIO_TIERRA * c;
    }
}