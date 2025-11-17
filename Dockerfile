FROM node:20-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Garante que a pasta de upload existe
RUN mkdir -p /usr/src/app/uploads && \
    chown -R node:node /usr/src/app/uploads

USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]
