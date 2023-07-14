FROM --platform=$BUILDPLATFORM ghcr.io/willnorris/willnorris.com-binaries:latest as binaries

# TODO: find a better image to use here. There's no need for go
FROM --platform=$BUILDPLATFORM cgr.dev/chainguard/wolfi-base as build
RUN apk update && apk add build-base git

WORKDIR /work
RUN git config --global --add safe.directory /work

COPY . .
COPY --from=binaries /hugo /hugo
RUN --mount=type=secret,id=IMAGEPROXY_SIGNATUREKEY \
    IMAGEPROXY_SIGNATUREKEY="$(cat /run/secrets/IMAGEPROXY_SIGNATUREKEY)" \
    /hugo

# Final image with just caddy binary and hugo output
FROM cgr.dev/chainguard/static:latest

COPY --from=build /work/public/ /public/
COPY --from=binaries /caddy /caddy
COPY ./etc/Caddyfile /Caddyfile

WORKDIR /

CMD ["run"]
ENTRYPOINT ["/caddy"]

EXPOSE 8080
