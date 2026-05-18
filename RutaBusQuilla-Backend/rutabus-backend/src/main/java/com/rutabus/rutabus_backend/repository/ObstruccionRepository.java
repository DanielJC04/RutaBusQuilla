package com.rutabus.rutabus_backend.repository;

import com.rutabus.rutabus_backend.model.Obstruccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ObstruccionRepository extends JpaRepository<Obstruccion, Long> {
    List<Obstruccion> findAllByOrderByFechaDesc();
}
