package com.jobtracker.backend.core.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO immuable représentant la structure standard des réponses d'erreur de
 * notre API.
 */
public record ErrorResponse(
        int status,
        String message,
        LocalDateTime timestamp,
        Map<String, String> errors) {
}
