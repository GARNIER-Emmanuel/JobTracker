package com.jobtracker.backend.joboffer;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// JpaRepository prend 2 paramètres : <NomDeLEntité, TypeDeCléPrimaire>
public interface JobOfferRepository extends JpaRepository<JobOffer, UUID> {
    // C'est tout ! Spring s'occupe de tout le reste (save, findById, delete, etc.)
}
