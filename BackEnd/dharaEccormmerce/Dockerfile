# -------- Stage 1: Build the application --------
FROM maven:3.8.4-openjdk-17 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# -------- Stage 2: Run the application --------
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/dharaEccormmerce-0.0.1-SNAPSHOT.jar .

# Expose application port
EXPOSE 2424

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/dharaEccormmerce-0.0.1-SNAPSHOT.jar"]
