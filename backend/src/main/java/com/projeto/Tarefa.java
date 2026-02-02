package com.projeto; // Remova se não estiver na pasta com/projeto

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Tarefa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id; // Público para simplificar (sem getters/setters)
    
    public String titulo;
    public String descricao;
    public Boolean concluida = false;
    public LocalDateTime dataCriacao = LocalDateTime.now();
}