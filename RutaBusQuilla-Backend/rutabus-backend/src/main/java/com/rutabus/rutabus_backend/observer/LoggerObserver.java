package com.rutabus.rutabus_backend.observer;

/**
 * Observador 1: Registra la obstruccion en el log del sistema.
 */
public class LoggerObserver implements ObstructorObserver {

    @Override
    public void actualizar(String nombreRuta, String descripcionObstruccion) {
        System.out.println("[LOG] Obstruccion detectada en ruta: " + nombreRuta
                + " | Descripcion: " + descripcionObstruccion);
    }
}