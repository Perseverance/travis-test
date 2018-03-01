### Step 1: Getting Node ###

# Node carbon
FROM node:carbon as website-builder

### Step 2: Building ###

WORKDIR /website
COPY package*.json ./

RUN npm install --only=production

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build

# Nginx 1.13.9
FROM nginx:1.13.9 as website-server

## Copy our default nginx config
COPY nginx-config/china.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=website-builder /website/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
