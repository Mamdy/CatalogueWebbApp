FROM node:alpine AS builder

RUN  mkdir -p /app

WORKDIR /app


COPY . . 

RUN npm install
RUN npm run build --prod


#CMD ["npm","start"]

FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/

