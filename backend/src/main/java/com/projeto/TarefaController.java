package com.projeto; // Remova se não estiver na pasta com/projeto

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*") // IMPORTANTE: Deixa o React acessar o Java
public class TarefaController {

    @Autowired
    private TarefaRepository repository;

    // Listar todas
    @GetMapping
    public List<Tarefa> listar() {
        return repository.findAll();
    }

    // Criar nova
    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa) {
        return repository.save(tarefa);
    }

    // Atualizar (Concluir/Editar)
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @RequestBody Tarefa dadosNovos) {
        return repository.findById(id)
            .map(tarefa -> {
                tarefa.titulo = dadosNovos.titulo;
                tarefa.descricao = dadosNovos.descricao;
                tarefa.concluida = dadosNovos.concluida;
                return ResponseEntity.ok(repository.save(tarefa));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}