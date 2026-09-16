package org.main.claimstreams.configs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

/**
 * Functionality: Dynamically compiles a PEM certificate into a runtime JKS truststore file for Kafka TLS handshakes.
 * Why it's required: Resolves "valid certification path" errors by providing Kafka's native SSL engine with a readable truststore file on cloud platforms like Render.
 */
@Component
public class SslContextInitializer {

    private static final Logger log = LoggerFactory.getLogger(SslContextInitializer.class);

    @Value("${CUSTOM_PEM_CERTIFICATE:}")
    private String pemCertificateProperty;

    @PostConstruct
    public void initializeCustomTrustStore() {
        if (pemCertificateProperty == null || pemCertificateProperty.isBlank()) {
            log.info("No custom PEM certificate provided. Skipping truststore generation.");
            return;
        }

        try {
            // 1. Normalize literal "\n" escape sequences to true newlines
            String normalizedPem = pemCertificateProperty.replace("\\n", "\n");
            byte[] certBytes = normalizedPem.getBytes(java.nio.charset.StandardCharsets.UTF_8);

            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            X509Certificate certificate;
            try (InputStream bis = new ByteArrayInputStream(certBytes)) {
                certificate = (X509Certificate) certFactory.generateCertificate(bis);
            }

            // 2. Build a local KeyStore in memory
            KeyStore trustStore = KeyStore.getInstance("JKS");
            trustStore.load(null, null);
            trustStore.setCertificateEntry("aiven-kafka-ca", certificate);

            // 3. Save it out to a secure temporary file on disk so Kafka can read it natively
            File tempTrustStoreFile = File.createTempFile("kafka-truststore", ".jks");
            tempTrustStoreFile.deleteOnExit();

            try (var fos = java.nio.file.Files.newOutputStream(tempTrustStoreFile.toPath())) {
                trustStore.store(fos, "secretpassword".toCharArray());
            }

            // 4. Dynamically set System properties so Kafka's native SSL engine picks up the truststore file path
            System.setProperty("kafka.truststore.path", tempTrustStoreFile.getAbsolutePath());
            System.setProperty("kafka.truststore.password", "secretpassword");

            log.info("Successfully generated runtime Kafka truststore at: {}", tempTrustStoreFile.getAbsolutePath());

        } catch (Exception e) {
            log.error("Failed to generate runtime Kafka truststore", e);
            throw new RuntimeException("Failed to generate runtime Kafka truststore", e);
        }
    }
}