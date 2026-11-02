FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

# Puppeteer apna Chrome khud download kare (galat path hatao)
ENV PUPPETEER_SKIP_DOWNLOAD=false \
    PUPPETEER_CACHE_DIR=/app/.cache/puppeteer \
    PUPPETEER_EXECUTABLE_PATH=""

COPY package*.json ./
RUN npm ci --omit=dev
RUN npx puppeteer browsers install chrome

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]