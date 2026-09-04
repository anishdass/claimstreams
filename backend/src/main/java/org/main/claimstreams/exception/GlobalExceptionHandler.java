/*
 * Global exception handler for REST controllers across the application.
 * Why is it required? Decouples HTTP status mapping and error response formatting
 * from core business logic in service classes.
 */

package org.main.claimstreams.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                        "message", ex.getMessage()
                )
        );
    }

    @ExceptionHandler(InvalidActionException.class)
    public ResponseEntity<Map<String, String>> handleInvalidActionException(InvalidActionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "message", ex.getMessage()
                )
        );
    }
}
