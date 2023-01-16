ARG HUGO_ENV_ARG=production

FROM cgr.dev/chainguard/go:1.19 as build

WORKDIR /work
RUN git config --global --add safe.directory /work

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -v ./cmd/caddy
RUN CGO_ENABLED=1 go build -v --tags extended ./cmd/hugo

RUN ./hugo

# Final image with just caddy binary and hugo output
FROM cgr.dev/chainguard/static:latest

COPY --from=build /work/public/ /public/
COPY --from=build /work/caddy /caddy
COPY ./etc/Caddyfile /Caddyfile

WORKDIR /

CMD ["run"]
ENTRYPOINT ["/caddy"]

EXPOSE 8080
