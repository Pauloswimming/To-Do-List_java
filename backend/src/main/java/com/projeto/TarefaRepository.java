package com.projeto; // Remova se não estiver na pasta com/projeto

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    // Só isso aqui já cria os métodos save(), findAll(), delete(), etc.
}