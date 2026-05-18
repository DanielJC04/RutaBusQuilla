package com.rutabus.rutabus_backend;

/**
 * Patron Singleton - Creacional
 * Garantiza una unica instancia del gestor de rutas en toda la aplicacion.
 * Centraliza el acceso a informacion global del sistema de rutas.
 */
public class GestorDeRutas {

    private static GestorDeRutas instancia;
    private String ciudadActiva;
    private int totalRutasActivas;

    // Constructor privado - nadie puede crear instancias desde afuera
    private GestorDeRutas() {
        this.ciudadActiva = "Barranquilla";
        this.totalRutasActivas = 0;
    }

    // Punto de acceso global - siempre devuelve la misma instancia
    public static GestorDeRutas getInstancia() {
        if (instancia == null) {
            instancia = new GestorDeRutas();
        }
        return instancia;
    }

    public String getCiudadActiva() {
        return ciudadActiva;
    }

    public int getTotalRutasActivas() {
        return totalRutasActivas;
    }

    public void setTotalRutasActivas(int total) {
        this.totalRutasActivas = total;
    }

    public String getEstadoSistema() {
        return "Ciudad: " + ciudadActiva + " | Rutas activas: " + totalRutasActivas;
    }
}
