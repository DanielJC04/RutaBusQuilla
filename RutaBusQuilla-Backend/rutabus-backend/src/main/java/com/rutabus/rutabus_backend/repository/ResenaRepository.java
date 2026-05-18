package com.rutabus.rutabus_backend.repository;

import com.rutabus.rutabus_backend.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByParadaIdOrderByFechaDesc(Long paradaId);
}
