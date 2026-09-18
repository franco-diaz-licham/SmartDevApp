FROM node:22-alpine

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm ci --include=optional

COPY ./frontend ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
