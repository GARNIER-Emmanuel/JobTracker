package com.jobtracker.backend.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // TODO: Étape 1 : Parcourir toutes les erreurs de validation
        // (Indices : Utilise ex.getBindingResult().getFieldErrors())
        // Pour chaque FieldError 'error', ajoute son champ et son message par défaut
        // dans la map 'errors'.
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        // TODO: Étape 2 : Instancier l'objet ErrorResponse avec les données :
        // status = 400
        // message = "Validation failed"
        // timestamp = LocalDateTime.now()
        // errors = la map construite ci-dessus
        ErrorResponse errorResponse = new ErrorResponse(400, "Validation failed", LocalDateTime.now(), errors);
        // TODO: Étape 3 : Retourner la ResponseEntity enveloppée du statut HTTP 400 Bad
        // Request
        return ResponseEntity.badRequest().body(errorResponse); // À remplacer par ton implémentation
    }
}
