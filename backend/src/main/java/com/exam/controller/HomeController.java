package com.exam.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "application", "Digital Examination and Evaluation Portal Backend",
            "status", "UP",
            "timestamp", LocalDateTime.now().toString(),
            "message", "Use /api/* endpoints for application features"
        );
    }
}
