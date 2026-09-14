package org.main.claimstreams.configs;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Component
public class KafkaTruststoreInitializer {

    @PostConstruct
    public void initializeTruststore() {
        try {
            ClassPathResource resource = new ClassPathResource("kafka.truststore.jks");
            if (resource.exists()) {
                File tempFile = File.createTempFile("kafka-truststore", ".jks");
                tempFile.deleteOnExit();

                try(InputStream inputStream=resource.getInputStream()){
                    Files.copy(inputStream, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                System.setProperty("kafka.truststore.path.override", tempFile.getAbsolutePath());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract kafka truststore to temporary file",e);
        }
    }
}
