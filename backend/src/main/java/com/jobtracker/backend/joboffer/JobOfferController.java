package com.jobtracker.backend.joboffer;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
public class JobOfferController {

    private final JobOfferService jobOfferService;

    // Injection par constructeur (recommandée)
    public JobOfferController(JobOfferService jobOfferService) {
        this.jobOfferService = jobOfferService;
    }

    // TODO: Implémente le point d'accès POST qui prend en entrée le DTO et renvoie
    // 201 Created
    @PostMapping
    public ResponseEntity<JobOfferDto> createJob(
            // @Valid déclenche la validation automatique du DTO
            // @RequestBody indique que le JSON doit être désérialisé dans cet objet
            @Valid @RequestBody JobOfferDto request) {
        // 1. On délègue le traitement métier au service
        JobOfferDto response = jobOfferService.saveJob(request);
        // 2. On renvoie la réponse enveloppée dans un ResponseEntity avec le statut 201
        // Created
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<JobOfferDto>> getAllJobs() {
        // TODO: Appelle ton service pour récupérer les offres
        List<JobOfferDto> response = jobOfferService.getAllJobs();

        // TODO: Retourne la liste enveloppée dans un ResponseEntity avec le statut 200
        // OK
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    // 1. On utilise @PathVariable pour extraire l'id de la route HTTP
    public ResponseEntity<JobOfferDto> getJobById(@PathVariable UUID id) {

        // 2. On appelle notre service qui nous renvoie un Optional
        // Et on utilise le map/orElse de l'Optional pour formuler la réponse !
        return jobOfferService.getJobById(id)
                .map(dto -> ResponseEntity.ok(dto)) // Si l'offre existe, on renvoie 200 OK avec le DTO
                .orElse(ResponseEntity.notFound().build()); // Si elle n'existe pas, on renvoie 404 Not Found
    }

    // @PostMapping
    // public ResponseEntity<JobOfferDto> updateJob(@PathVariable UUID id) {
    // // 1. On délègue le traitement métier au service
    // JobOfferDto response;
    // // 2. On renvoie la réponse enveloppée dans un ResponseEntity avec le statut
    // 201
    // // Created
    // return ResponseEntity.status(HttpStatus.CREATED).body(response);
    // }
}
