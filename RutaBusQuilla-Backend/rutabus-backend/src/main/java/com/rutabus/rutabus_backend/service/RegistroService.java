package com.rutabus.rutabus_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.rutabus.rutabus_backend.model.Registro;
import com.rutabus.rutabus_backend.repository.RegistroRepository;

@Service
public class RegistroService {

    private final RegistroRepository registroRepository;

    public RegistroService(RegistroRepository registroRepository) {
        this.registroRepository = registroRepository;
    }

    public Registro registrar(Registro registro) {
        if (registroRepository.existsByCorreo(registro.getCorreo())) {
            throw new RuntimeException("El correo ya esta registrado");
        }
        registro.setRol(Registro.Rol.USUARIO);
        return registroRepository.save(registro);
    }

    public List<Registro> obtenerTodos() {
        return registroRepository.findAll();
    }

    public Optional<Registro> obtenerPorId(Long id) {
        return registroRepository.findById(id);
    }

    public Optional<Registro> obtenerPorCorreo(String correo) {
        return registroRepository.findByCorreo(correo);
    }

    public void eliminar(Long id) {
        registroRepository.deleteById(id);
    }
}
