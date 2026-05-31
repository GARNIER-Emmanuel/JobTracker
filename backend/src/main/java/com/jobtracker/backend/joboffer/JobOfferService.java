package com.jobtracker.backend.joboffer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class JobOfferService {
    private final JobOfferRepository jobOfferRepository;

    // Injection par constructeur de notre outil de stockage
    public JobOfferService(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public JobOfferDto saveJob(JobOfferDto request) {
        // 1. Créer le plat final (l'entité JPA)
        JobOffer entity = new JobOffer();

        // 2. Générer un identifiant unique
        entity.setId(UUID.randomUUID());

        // TODO: Recopie les valeurs du DTO request dans ton entity
        // Exemple : entity.setTitle(request.title());
        entity.setTitle(request.title());
        entity.setCompany(request.company());
        entity.setOfferUrl(request.offerUrl());
        entity.setApplicationDate(request.applicationDate());
        entity.setStatus(request.status());
        // 3. Sauvegarder dans le frigo (base de données)
        jobOfferRepository.save(entity);
        // 4. Retourner le résultat
        return request;
    }

    public List<JobOfferDto> getAllJobs() {
        // 1. Créer le plat final (l'entité JPA)
        return List.of();
    }

    public Optional<JobOfferDto> getJobById(UUID id) {
        // 1. On cherche l'entité en base grâce à son UUID
        Optional<JobOffer> entityOptional = jobOfferRepository.findById(id);
        // 2. On convertit l'entité trouvée en DTO (si elle existe)
        // La méthode .map() de l'Optional permet de faire cette conversion proprement
        return entityOptional.map(entity -> new JobOfferDto(
                entity.getTitle(),
                entity.getCompany(),
                entity.getOfferUrl(),
                entity.getApplicationDate(),
                entity.getStatus()));
    }

    // N'oublie pas d'importer java.util.Optional et java.util.UUID si nécessaire
    public Optional<JobOfferDto> updateJob(UUID id, JobOfferDto request) {
        // Pour l'instant, on se contente de retourner un Optional rempli pour faire
        // compiler
        return Optional.of(request);
    }

}
