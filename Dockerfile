# =========================
# 1️] BUILD STAGE
# =========================
FROM node:20-alpine3.21 AS builder

# Create app directory
WORKDIR /server

# Copy dependency files first (better caching)
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy application source code
COPY . .


# =========================
# 2️] RUNTIME STAGE
# =========================
FROM node:20-alpine3.21

# Create app directory
WORKDIR /server

# Copy ONLY what is needed from builder
COPY --from=builder /server /server

# Expose app port
EXPOSE 5000

# Run app in production
CMD ["npm", "run", "prod"]
