/*
 * Custom runtime exception representing a missing business entity.
 * Why is it required? Provides a typed domain exception that can be thrown
 * throughout the service layer and translated into an HTTP 404 response globally.
 */

package org.main.claimstreams.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}