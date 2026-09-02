package org.main.claimstreams;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ClaimstreamsApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // Prevents crashes when deploying to staging/prod where true environment variables are injected
                .load();

        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        SpringApplication.run(ClaimstreamsApplication.class, args);
    }

}
