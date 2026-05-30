package com.jobtracker.backend.joboffer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDate;

public record JobOfferDto(
        @NotBlank(message = "Le titre est obligatoire") String title,

        @NotBlank(message = "L'entreprise est obligatoire") String company,

        @NotBlank(message = "L'URL est obligatoire") @URL(message = "Le format de l'URL est invalide") String offerUrl,

        @NotNull(message = "La date de candidature est obligatoire") LocalDate applicationDate,

        @NotNull(message = "Le statut est obligatoire") String status // On utilise String ici pour simplifier la
                                                                      // réception du JSON
) {
}
