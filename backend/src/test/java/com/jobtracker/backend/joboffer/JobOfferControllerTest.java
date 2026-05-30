package com.jobtracker.backend.joboffer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
}
