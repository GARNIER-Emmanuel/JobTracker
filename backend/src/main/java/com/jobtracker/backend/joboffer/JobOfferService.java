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

        // Recopie de toutes les valeurs du DTO dans l'entité
        entity.setTitle(request.title());
        entity.setCompany(request.company());
        entity.setLocation(request.location());
        entity.setOfferUrl(request.offerUrl());
        entity.setSalary(request.salary());
        entity.setContactName(request.contactName());
        entity.setStatus(request.status());
        entity.setContacted(request.contacted());
        entity.setResponse(request.response());
        entity.setRemoteWork(request.remoteWork());
        entity.setApplicationDate(request.applicationDate());
        entity.setNotes(request.notes());

        // 3. Sauvegarder dans le frigo (base de données)
        jobOfferRepository.save(entity);

        // 4. Retourner le résultat complet avec l'UUID généré
        return new JobOfferDto(
                entity.getId(),
                entity.getTitle(),
                entity.getCompany(),
                entity.getLocation(),
                entity.getOfferUrl(),
                entity.getSalary(),
                entity.getContactName(),
                entity.getStatus(),
                entity.isContacted(),
                entity.getResponse(),
                entity.getRemoteWork(),
                entity.getApplicationDate(),
                entity.getNotes());
    }

    public List<JobOfferDto> getAllJobs() {
        return jobOfferRepository.findAll().stream()
                .map(entity -> new JobOfferDto(
                        entity.getId(),
                        entity.getTitle(),
                        entity.getCompany(),
                        entity.getLocation(),
                        entity.getOfferUrl(),
                        entity.getSalary(),
                        entity.getContactName(),
                        entity.getStatus(),
                        entity.isContacted(),
                        entity.getResponse(),
                        entity.getRemoteWork(),
                        entity.getApplicationDate(),
                        entity.getNotes()))
                .toList();
    }

    public Optional<JobOfferDto> getJobById(UUID id) {
        // 1. On cherche l'entité en base grâce à son UUID
        Optional<JobOffer> entityOptional = jobOfferRepository.findById(id);
        // 2. On convertit l'entité trouvée en DTO (si elle existe)
        return entityOptional.map(entity -> new JobOfferDto(
                entity.getId(),
                entity.getTitle(),
                entity.getCompany(),
                entity.getLocation(),
                entity.getOfferUrl(),
                entity.getSalary(),
                entity.getContactName(),
                entity.getStatus(),
                entity.isContacted(),
                entity.getResponse(),
                entity.getRemoteWork(),
                entity.getApplicationDate(),
                entity.getNotes()));
    }

    public Optional<JobOfferDto> updateJob(UUID id, JobOfferDto request) {
        return jobOfferRepository.findById(id)
                .map(existingJob -> {
                    // a. Mettre à jour tous les champs de l'entité existante
                    existingJob.setTitle(request.title());
                    existingJob.setCompany(request.company());
                    existingJob.setLocation(request.location());
                    existingJob.setOfferUrl(request.offerUrl());
                    existingJob.setSalary(request.salary());
                    existingJob.setContactName(request.contactName());
                    existingJob.setStatus(request.status());
                    existingJob.setContacted(request.contacted());
                    existingJob.setResponse(request.response());
                    existingJob.setRemoteWork(request.remoteWork());
                    existingJob.setApplicationDate(request.applicationDate());
                    existingJob.setNotes(request.notes());

                    // b. Sauvegarder l'entité modifiée en base de données
                    JobOffer savedJob = jobOfferRepository.save(existingJob);

                    // c. Retourner le DTO complet correspondant à l'entité sauvegardée
                    return new JobOfferDto(
                            savedJob.getId(),
                            savedJob.getTitle(),
                            savedJob.getCompany(),
                            savedJob.getLocation(),
                            savedJob.getOfferUrl(),
                            savedJob.getSalary(),
                            savedJob.getContactName(),
                            savedJob.getStatus(),
                            savedJob.isContacted(),
                            savedJob.getResponse(),
                            savedJob.getRemoteWork(),
                            savedJob.getApplicationDate(),
                            savedJob.getNotes());
                }); // Si l'id n'existe pas en base, findById retourne Optional.empty() et le map
                    // n'est pas exécuté
    }

    public boolean deleteJob(UUID id) {
        // 1. On vérifie si l'entité existe en base de données
        if (jobOfferRepository.existsById(id)) {
            // 2. Si oui, on la supprime
            jobOfferRepository.deleteById(id);
            // 3. Et on retourne true pour confirmer la suppression
            return true;
        }
        // 4. Si non, on retourne false directement
        return false;
    }

}
