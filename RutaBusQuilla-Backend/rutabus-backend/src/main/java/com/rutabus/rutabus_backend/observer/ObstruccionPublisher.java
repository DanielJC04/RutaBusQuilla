package com.rutabus.rutabus_backend.observer;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

/**
 * Publicador - Mantiene la lista de observadores y los notifica.
 */
@Component
public class ObstruccionPublisher {

    private final List<ObstructorObserver> observadores = new ArrayList<>();

    public ObstruccionPublisher() {
        observadores.add(new LoggerObserver());
        observadores.add(new NotificadorObserver());
    }

    public void agregarObservador(ObstructorObserver observador) {
        observadores.add(observador);
    }

    public void notificarObstruccion(String nombreRuta, String descripcion) {
        for (ObstructorObserver observador : observadores) {
            observador.actualizar(nombreRuta, descripcion);
        }
    }
}