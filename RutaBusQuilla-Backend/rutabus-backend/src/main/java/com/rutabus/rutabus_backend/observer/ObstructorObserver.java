package com.rutabus.rutabus_backend.observer;

/**
 * Patron Observer - Comportamiento
 * Interfaz que deben implementar todos los observadores de obstrucciones.
 */
public interface ObstructorObserver {
    void actualizar(String nombreRuta, String descripcionObstruccion);
}