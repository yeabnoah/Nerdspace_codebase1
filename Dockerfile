FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm run build && pnpm run start"] 