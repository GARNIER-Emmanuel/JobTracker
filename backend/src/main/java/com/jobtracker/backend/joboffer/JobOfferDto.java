package com.jobtracker.backend.joboffer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record JobOfferDto(
                UUID id,
                @NotBlank(message = "Le titre est obligatoire") String title,
                @NotBlank(message = "L'entreprise est obligatoire") String company,
                String location, // optionnel
                @NotBlank(message = "L'URL est obligatoire") String offerUrl,
                java.math.BigDecimal salary, // optionnel
                String contactName, // optionnel
                @NotNull(message = "Le statut est obligatoire") String status,
                boolean contacted,
                String response,
                String remoteWork,
                @NotNull(message = "La date de candidature est obligatoire") LocalDate applicationDate,
                String notes // optionnel
) {
}
