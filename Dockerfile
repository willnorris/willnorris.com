ARG HUGO_ENV_ARG=production
FROM klakegg/hugo:ext-alpine-onbuild AS hugo

FROM caddy:latest

COPY --from=hugo /target/ /srv/public/
COPY ./Caddyfile /srv/Caddyfile

WORKDIR /srv

CMD ["run"]
ENTRYPOINT ["caddy"]

EXPOSE 8080
