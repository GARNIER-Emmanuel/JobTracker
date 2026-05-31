package com.jobtracker.backend.joboffer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    void should_return_404_when_job_offer_does_not_exist() throws Exception {
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

}
