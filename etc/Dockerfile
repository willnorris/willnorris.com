FROM --platform=$BUILDPLATFORM ghcr.io/willnorris/willnorris.com-binaries:latest AS build

WORKDIR /work
RUN git config --global --add safe.directory /work

COPY . .
RUN npm install
RUN --mount=type=secret,id=IMAGEPROXY_SIGNATUREKEY \
    IMAGEPROXY_SIGNATUREKEY="$(cat /run/secrets/IMAGEPROXY_SIGNATUREKEY)" \
    /hugo

# Final image with just caddy binary and hugo output
FROM cgr.dev/chainguard/static:latest

COPY --from=build /work/public/ /public/
COPY --from=build /caddy /caddy
COPY ./etc/Caddyfile /Caddyfile

WORKDIR /

CMD ["run"]
ENTRYPOINT ["/caddy"]

EXPOSE 8080
