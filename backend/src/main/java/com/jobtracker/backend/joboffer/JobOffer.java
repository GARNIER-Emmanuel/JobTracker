package com.jobtracker.backend.joboffer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "job_offers")
@Data // Génère automatiquement les getters, setters et toString grâce à Lombok !
@NoArgsConstructor // Génère le constructeur vide obligatoire pour JPA
public class JobOffer {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String location;

    @Column(name = "offer_url", nullable = false)
    private String offerUrl;

    private BigDecimal salary;

    @Column(name = "contact_name")
    private String contactName;

    @Column(nullable = false)
    private String status;

    private boolean contacted = false;

    private String response = "PENDING";

    @Column(name = "remote_work")
    private String remoteWork = "NONE";

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}