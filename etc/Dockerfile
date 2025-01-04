FROM --platform=$BUILDPLATFORM ghcr.io/willnorris/willnorris.com-binaries:latest AS binaries

FROM --platform=$BUILDPLATFORM cgr.dev/chainguard/wolfi-base AS build
RUN apk update && apk add build-base git

WORKDIR /work
RUN git config --global --add safe.directory /work

COPY . .
COPY --from=binaries /hugo /bin/hugo
COPY --from=binaries /bun /bin/bun
RUN ln -s bun /bin/bunx && ln -s bun /bin/npx && ln -s bun /bin/node && bun install
RUN --mount=type=secret,id=IMAGEPROXY_SIGNATUREKEY \
    IMAGEPROXY_SIGNATUREKEY="$(cat /run/secrets/IMAGEPROXY_SIGNATUREKEY)" \
    hugo

# Final image with just caddy binary and hugo output
FROM cgr.dev/chainguard/static:latest

COPY --from=build /work/public/ /public/
COPY --from=binaries /caddy /caddy
COPY ./etc/Caddyfile /Caddyfile

WORKDIR /

CMD ["run"]
ENTRYPOINT ["/caddy"]

EXPOSE 8080
