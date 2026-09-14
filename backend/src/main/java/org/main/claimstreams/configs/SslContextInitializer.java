
/*
 * SslContextInitializer.java
 *
 * Functionality: Dynamically loads a PEM certificate from configuration properties at application boot.
 * Why is it required: Adheres to configuration management best practices by keeping sensitive secrets and certificates out of compiled source code.
 */

package org.main.claimstreams.configs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.SSLContext;

@Component
public class SslContextInitializer {

    private static final Logger log = LoggerFactory.getLogger(SslContextInitializer.class);

    @Value("${spring.kafka.ssl.truststore-certificate}")
    private String pemCertificateProperty;

    @PostConstruct
    public void initializeCustomTrustStore() {
        if (pemCertificateProperty == null || pemCertificateProperty.isBlank()) {
            log.info("No custom PEM certificate provided. Skipping programmatic trust store injection.");
            return;
        }

        try {
            String normalizedPem = pemCertificateProperty.replace("\\n", "\n");

            byte[] certBytes = normalizedPem.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            X509Certificate certificate;

            try (InputStream bis = new ByteArrayInputStream(certBytes)) {
                certificate = (X509Certificate) certFactory.generateCertificate(bis);
            }

            KeyStore defaultTrustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            defaultTrustStore.load(null, null);
            defaultTrustStore.setCertificateEntry("custom-cloud-ca", certificate);

            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(defaultTrustStore);

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, tmf.getTrustManagers(), new java.security.SecureRandom());
            SSLContext.setDefault(sslContext);

            log.info("Successfully registered custom PEM certificate from environment properties into JVM default trust store.");

        } catch (Exception e) {
            log.error("Failed to initialize custom SSL trust store from properties", e);
            throw new RuntimeException("Failed to initialize custom SSL trust store", e);
        }
    }
}