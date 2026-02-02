package com.projeto; // Remova se não estiver na pasta com/projeto

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TodoListApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoListApplication.class, args);
        System.out.println("✅ Servidor rodando em http://localhost:8080");
    }
}