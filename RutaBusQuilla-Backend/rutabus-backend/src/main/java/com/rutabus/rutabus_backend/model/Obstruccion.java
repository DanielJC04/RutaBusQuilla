package com.rutabus.rutabus_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "obstruccion")
public class Obstruccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreRuta;
    private String nombreParada;
    private String descripcion;
    private boolean activa;
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
        this.activa = true;
    }

    public Obstruccion() {}

    public Long getId() { return id; }
    public String getNombreRuta() { return nombreRuta; }
    public void setNombreRuta(String nombreRuta) { this.nombreRuta = nombreRuta; }
    public String getNombreParada() { return nombreParada; }
    public void setNombreParada(String nombreParada) { this.nombreParada = nombreParada; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }
    public LocalDateTime getFecha() { return fecha; }
}
