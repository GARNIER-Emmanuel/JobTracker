package com.jobtracker.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
// On indique à Spring de ne pas remplacer notre base Neon par une base
// embarquée durant ce test
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

class JobOfferPersisTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void should_have_job_offers_table_created_by_flyway() {
        // Act : Tente de compter les lignes de la table job_offers
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM job_offers", Integer.class);
        // Assert : La table doit exister (si elle n'existe pas, SQLState lancera une
        // exception et le test sera rouge)
        assertThat(count).isGreaterThanOrEqualTo(0);
    }
}
