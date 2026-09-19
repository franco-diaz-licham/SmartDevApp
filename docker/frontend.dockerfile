FROM node:22-alpine

WORKDIR /app

COPY ./src/SmartDev.UI/package*.json ./

RUN npm ci --include=optional

COPY ./src/SmartDev.UI ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
