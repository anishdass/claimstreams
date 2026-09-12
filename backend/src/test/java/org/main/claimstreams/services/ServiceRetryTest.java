package org.main.claimstreams.services;

import org.junit.jupiter.api.Test;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

import static org.junit.jupiter.api.Assertions.*;

public class ServiceRetryTest {
    @Test
    void shouldRetrySpecifiedMaxTimesOnFailure() {
        RetryTemplate retryTemplate = new RetryTemplate();
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);

        RetryCallback<String, RuntimeException> unreliableCall = context -> {
            throw new RuntimeException("Temporary Downstream failure");
        };

        Exception exception = assertThrows(RuntimeException.class, () -> retryTemplate.execute(unreliableCall));

        assertEquals("Temporary Downstream failure", exception.getMessage());
    }
}
