---
title: macOS Workstation
---

{{<toc>}}

## Host Configuration ##

Set the Computer Name in the macOS Sharing Preference Pane.

## SSH key ##

If needed, create a new SSH key

``` sh
ssh-keygen -t rsa -b 4096
```

## Homebrew ##

``` sh
sudo mkdir /opt/homebrew
sudo chown `whoami` /opt/homebrew
git clone https://github.com/Homebrew/brew.git /opt/homebrew
```

## Dotfiles ##

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>:

``` sh
git clone https://github.com/willnorris/dotfiles ~/.dotfiles
PATH="~/.dotfiles/rcm/bin:$PATH" rcup
```

## Homebrew Packages ##

Install [Homebrew packages](https://github.com/willnorris/dotfiles/blob/master/Brewfile) (this will
take a while):

``` sh
brew tap Homebrew/bundle

cd ~/.dotfiles
brew bundle
```

## Nginx ##

Update nginx config `/opt/homebrew/etc/nginx/nginx.conf` to contain:

``` nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    sendfile on;
    keepalive_timeout 65;

    # php-fpm
    upstream php { server localhost:9000; }
    include fastcgi.conf;
    fastcgi_index  index.php;
    fastcgi_intercept_errors on;

    include /var/www/*/etc/nginx-local.conf;

    # default server config for .dev hosts
    server {
        server_name ~^(?<domain>.+)\.dev$;
        root /var/www/$domain/public;
        index index.php;
        location ~ \.php$ {
            fastcgi_pass php;
        }
    }
}
```

Symlink `/var/www` to `$HOME/Sites`:

``` sh
sudo ln -s $HOME/Sites /var/www
```

In order to run on port 80, start as root:

``` sh
sudo /opt/hombrew/bin/brew services start nginx-full
```

## MySQL ##

Secure the installation:

``` sh
mysql_secure_installation
```

## /etc/hosts ##

```
sudo vi /etc/hosts

# local development
127.0.0.1  mysql.dev
```

## phpMyAdmin ##

``` sh
mkdir -p ~/Sites/mysql
ln -s /opt/homebrew/share/phpmyadmin ~/Sites/mysql/public
```

Edit `/opt/homebrew/etc/phpmyadmin.config.inc.php` to contain:

``` php
$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '<password>';
```

## Ruby ##

[Use rbenv](https://github.com/sstephenson/rbenv)
