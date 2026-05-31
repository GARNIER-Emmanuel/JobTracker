package com.jobtracker.backend.joboffer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JobOfferController.class)
class JobOfferControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private JobOfferService jobOfferService; // Nous aurons besoin de mocker le service

        @Test
        void should_create_job_offer_and_return_201_when_valid() throws Exception {
                // Arrange : Prépare un JSON valide correspondant à notre DTO de création
                String validJobOfferJson = """
                                {
                                    "title": "Développeur Fullstack Java/Angular",
                                    "company": "Google",
                                    "offerUrl": "https://careers.google.com/jobs/123",
                                    "applicationDate": "2026-05-29",
                                    "status": "APPLIED"
                                }
                                """;

                // Act & Assert : Tente d'appeler POST /api/jobs et s'attend à un 201 Created
                mockMvc.perform(post("/api/jobs")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(validJobOfferJson))
                                .andExpect(status().isCreated());
        }

        @Test
        void should_get_all_job_offers_and_return_200() throws Exception {
                // Arrange : Prépare une liste fictive contenant une offre d'emploi DTO
                JobOfferDto mockOffer = new JobOfferDto(
                                "Développeur Fullstack Java/Angular",
                                "Google",
                                "https://careers.google.com/jobs/123",
                                java.time.LocalDate.now(),
                                "APPLIED");

                // Programmer le mock : "Quand le service est sollicité pour findAll, il
                // retourne notre liste"
                org.mockito.Mockito.when(jobOfferService.getAllJobs())
                                .thenReturn(java.util.List.of(mockOffer));

                // Act & Assert : Tente d'appeler GET /api/jobs
                mockMvc.perform(get("/api/jobs")
                                .contentType(MediaType.APPLICATION_JSON))
                                // On s'attend à recevoir 200 OK
                                .andExpect(status().isOk())
                                // On peut optionnellement vérifier que le JSON renvoyé contient bien nos
                                // données
                                .andExpect(jsonPath("$[0].title").value("Développeur Fullstack Java/Angular"))
                                .andExpect(jsonPath("$[0].company").value("Google"));
        }

        @Test
        void should_get_a_job_offers_and_return_200_when_exist() throws Exception {
                // 1. On génère un UUID factice pour notre test
                java.util.UUID jobId = java.util.UUID.randomUUID();
                // Arrange : Prépare une liste fictive contenant une offre d'emploi DTO
                JobOfferDto mockOffer = new JobOfferDto(
                                "Développeur Fullstack Java/Angular",
                                "Google",
                                "https://careers.google.com/jobs/123",
                                java.time.LocalDate.now(),
                                "APPLIED");

                // 3. On programme le mock : "Quand le service reçoit CET UUID, il retourne
                // notre offre"
                // On utilise Optional.of(mockOffer) pour indiquer que l'offre a bien été
                // trouvée
                org.mockito.Mockito.when(jobOfferService.getJobById(jobId))
                                .thenReturn(java.util.Optional.of(mockOffer));

                // Act & Assert : Tente d'appeler GET /api/jobs
                mockMvc.perform(get("/api/jobs/" + jobId)
                                .contentType(MediaType.APPLICATION_JSON))
                                // On s'attend à recevoir 200 OK
                                .andExpect(status().isOk())
                                // On peut optionnellement vérifier que le JSON renvoyé contient bien nos
                                // données
                                .andExpect(jsonPath("$.title").value("Développeur Fullstack Java/Angular"))
                                .andExpect(jsonPath("$.company").value("Google"));
        }

        @Test
        void should_return_404_when_get_job_offer_does_not_exist() throws Exception {
                java.util.UUID nonExistentId = java.util.UUID.randomUUID();
                // On programme le mock : "Quand on cherche un ID inconnu, on retourne du vide
                // (Optional.empty())"
                org.mockito.Mockito.when(jobOfferService.getJobById(nonExistentId))
                                .thenReturn(java.util.Optional.empty());
                // Act & Assert
                mockMvc.perform(get("/api/jobs/" + nonExistentId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound());
        }

        @Test
        void should_update_a_job_offers_and_return_200_when_exist() throws Exception {
                // 1. On génère un UUID factice pour notre test
                java.util.UUID jobId = java.util.UUID.randomUUID();
                // Arrange : Prépare une liste fictive contenant une offre d'emploi DTO

                // 1. Arrange : Le JSON contenant les modifications envoyées par le client
                String updatedJobOfferJson = """
                                {
                                    "title": "Développeur Senior Java/Angular",
                                    "company": "Google France",
                                    "offerUrl": "https://careers.google.com/jobs/123",
                                    "applicationDate": "2026-05-31",
                                    "status": "INTERVIEW"
                                }
                                """;
                // Le DTO mis à jour que notre faux service va retourner
                JobOfferDto upMockOffer = new JobOfferDto(
                                "Développeur Senior Java/Angular",
                                "Google France",
                                "https://careers.google.com/jobs/123",
                                java.time.LocalDate.parse("2026-05-31"),
                                "INTERVIEW");

                // On programme le mock : "Quand on appelle updateJob avec cet ID et N'IMPORTE
                // QUEL DTO, on retourne notre offre mise à jour"
                org.mockito.Mockito
                                .when(jobOfferService.updateJob(org.mockito.Mockito.eq(jobId),
                                                org.mockito.Mockito.any(JobOfferDto.class)))
                                .thenReturn(java.util.Optional.of(upMockOffer));

                // 2. Act & Assert : On simule l'appel PUT /api/jobs/{id}
                mockMvc.perform(put("/api/jobs/" + jobId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(updatedJobOfferJson)) // On envoie le JSON de modification !
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Développeur Senior Java/Angular"))
                                .andExpect(jsonPath("$.company").value("Google France"));
        }

        @Test
        void should_return_404_when_update_job_offer_does_not_exist() throws Exception {
                java.util.UUID nonExistentId = java.util.UUID.randomUUID();

                String updatedJobOfferJson = """
                                {
                                    "title": "Développeur Senior Java/Angular",
                                    "company": "Google France",
                                    "offerUrl": "https://careers.google.com/jobs/123",
                                    "applicationDate": "2026-05-31",
                                    "status": "INTERVIEW"
                                }
                                """;
                // On programme le mock : "Quand on cherche un ID inconnu, on retourne du vide
                // (Optional.empty())"
                org.mockito.Mockito
                                .when(jobOfferService.updateJob(
                                                org.mockito.Mockito.eq(nonExistentId),
                                                org.mockito.Mockito.any(JobOfferDto.class)))
                                .thenReturn(java.util.Optional.empty());
                // Act & Assert
                mockMvc.perform(put("/api/jobs/" + nonExistentId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(updatedJobOfferJson)) // On passe le JSON obligatoire
                                .andExpect(status().isNotFound());
        }

        @Test
        void should_delete_job_offer_and_return_204_when_exist() throws Exception {
                java.util.UUID jobId = java.util.UUID.randomUUID();
                // On programme le mock : si l'ID est trouvé, le service renvoie true
                org.mockito.Mockito.when(jobOfferService.deleteJob(jobId)).thenReturn(true);
                // Act & Assert
                mockMvc.perform(delete("/api/jobs/" + jobId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNoContent()); // 204 No Content
        }

        @Test
        void should_return_404_when_deleting_non_existent_job_offer() throws Exception {
                java.util.UUID nonExistentId = java.util.UUID.randomUUID();
                // On programme le mock : si l'ID n'est pas trouvé, le service renvoie false
                org.mockito.Mockito.when(jobOfferService.deleteJob(nonExistentId)).thenReturn(false);
                // Act & Assert
                mockMvc.perform(delete("/api/jobs/" + nonExistentId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound()); // 404 Not Found
        }

        @Test
        void should_return_400_and_custom_error_format_when_title_is_blank() throws Exception {
                // 1. Arrange : On prépare un JSON invalide (le titre est vide, ce qui est
                // interdit)
                String invalidJobOfferJson = """
                                {
                                    "title": "",
                                    "company": "Google",
                                    "offerUrl": "https://careers.google.com/jobs/123",
                                    "applicationDate": "2026-05-29",
                                    "status": "APPLIED"
                                }
                                """;

                // 2. Act & Assert
                mockMvc.perform(post("/api/jobs")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(invalidJobOfferJson))
                                // On s'attend à un statut 400 Bad Request
                                .andExpect(status().isBadRequest())
                                // On vérifie que la réponse contient notre structure personnalisée d'erreur
                                .andExpect(jsonPath("$.status").value(400))
                                .andExpect(jsonPath("$.message").value("Validation failed"))
                                .andExpect(jsonPath("$.errors.title").exists());
        }

}
