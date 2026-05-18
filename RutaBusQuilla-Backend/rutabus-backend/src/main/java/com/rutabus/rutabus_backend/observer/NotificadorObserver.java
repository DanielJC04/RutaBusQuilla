package com.rutabus.rutabus_backend.observer;

/**
 * Observador 2: Simula el envio de una notificacion a los usuarios afectados.
 */
public class NotificadorObserver implements ObstructorObserver {

    @Override
    public void actualizar(String nombreRuta, String descripcionObstruccion) {
        System.out.println("[NOTIFICACION] Usuarios de la ruta '" + nombreRuta
                + "' han sido notificados: " + descripcionObstruccion);
    }
}