FROM denoland/deno:alpine-1.30.3

# Add git to our slim container, it's not included by default
RUN apk add --no-cache git

USER deno

WORKDIR /app/

# Copy the deps.ts and cache it's imports. This means that this layer should
# only change whenever our dependencies change, making builds faster.
COPY crawler/deps.ts crawler/
COPY crawler/deno.lock crawler/
COPY crawler/deno.jsonc crawler/

WORKDIR /app/crawler/
RUN deno cache deps.ts

WORKDIR /app/
COPY shared shared
COPY crawler/main.ts crawler/
COPY crawler/src/ crawler/src/

WORKDIR /app/crawler/
CMD [ "deno", "task", "start" ]
