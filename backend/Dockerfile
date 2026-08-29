# Dockerfile (Backend)
# Functionality: Defines a multi-stage container build for the Spring Boot backend service.
# Why it is required: Uses pre-installed Maven in Stage 1 to reliably package the application JAR without relying on wrapper script dependencies, then copies artifacts to a minimal JRE container in Stage 2.

# Stage 1: Build the JAR file using pre-installed Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and source files
COPY pom.xml .
COPY src ./src

# Build the application JAR
RUN mvn clean package -DskipTests

# Stage 2: Minimal Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]