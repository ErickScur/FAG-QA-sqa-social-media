FROM node:24-alpine

WORKDIR /app

ARG NEXT_PUBLIC_BASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
