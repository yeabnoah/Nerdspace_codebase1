FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

ENV DATABASE_URL="postgresql://nerdspace_owner:npg_AbX5qkF3HZCo@ep-morning-violet-a46e1r3k-pooler.us-east-1.aws.neon.tech/nerdspace?sslmode=require"
ENV BETTER_AUTH_SECRET=63Vf6Ls6SKFPu3M25S33DsWxK4c3PjwA
ENV BETTER_AUTH_URL=http://localhost:3000
ENV GITHUB_CLIENT_ID=Ov23lijfKanxvhF3n4w0
ENV GITHUB_CLIENT_SECRET=b1eff1314feb8e02fae3f0fe138a36c0e811f119

ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/dsaitxphg/image/upload
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nerdspace
ENV CLOUDINARY_URL=cloudinary://821468621844863:-Sfpe0psLooFXHNdAK6sYcYWa1E@dsaitxphg

ENV NEXT_PUBLIC_AUTH_URL=http://localhost:3000
ENV NODE_ENV=production

ENV EMAIL_USER=yeabnoah5@gmail.com
ENV EMAIL_PASS=iepbhmcovlxjuikj

ENV NEXT_PUBLIC_POSTHOG_KEY=phc_kVJYbcd3KXNUzyiGjGjrYSv5DJkPocnEQQoRaMWkQzz
ENV NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com



CMD ["sh", "-c", "pnpm run build && pnpm run start"] 