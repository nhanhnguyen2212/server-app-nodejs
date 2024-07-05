# FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:lts-alpine3.19

# FROM --platform=linux/arm64 node:18

# FROM public.ecr.aws/docker/library/node:lts-alpine3.19
# FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:lts-alpine3.19 
FROM --platform=linux/amd64 node:20

# FROM public.ecr.aws/docker/library/node:18

#configure working directory

WORKDIR /app 

RUN apt-get update && apt-get install -y iputils-ping

RUN mkdir -p /app/data

RUN mkdir -p /app/cache

COPY package*.json /app/

RUN npm install



COPY . ./

EXPOSE 8080 
CMD ["npm", "start"]