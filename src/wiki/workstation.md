---
layout: default
title: OS X Workstation
---

# Setting up OS X #


## Host Configuration ##

Set the Computer Name in the OS X Sharing Preference Pane.  If necessary, also
configure a custom hostname by adding the following to `/etc/hostconfig`:

    HOSTNAME=<hostname>

## SSH key ##

If needed, create a new SSH key

    ssh-keygen -t rsa -b 4096

## Dotfiles ##

[Install homedir and dotfiles](https://github.com/willnorris/dotfiles#readme)

## Homebrew ##

    sudo mkdir /opt/homebrew
    sudo chown `whoami` /opt/homebrew
    git clone https://github.com/Homebrew/homebrew.git /opt/homebrew

Full installation docs at <https://github.com/Homebrew/homebrew/wiki/Installation>

Ensure that /opt/homebrew/bin is in the path (for example: [mordecai.env][])

[mordecai.env]: https://github.com/willnorris/dotfiles/blob/233a786841cb9c44e7e91ff21fdf73ad1a16efa7/zsh/.zsh/host/mordecai.env#L1-L4

### Packages ###

[List of previous packages installed](brew-list.txt)

## Nginx ##

    brew install nginx

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
    include /Users/willnorris/Sites/*/nginx.conf;
}
```

In order to run on port 80, the launchctl config must be installed in `/Library/LaunchAgents`:

    sudo cp /opt/homebrew/opt/nginx/homebrew.mxcl.nginx.plist /Library/LaunchAgents
    sudo chown root /Library/LaunchAgents/homebrew.mxcl.nginx.plist
    sudo launchctl load /Library/LaunchAgents/homebrew.mxcl.nginx.plist

## MySQL ##

    brew install mysql
    mysql_install_db --verbose --user=$(whoami) --basedir="$(brew --prefix mysql)" --datadir=/opt/homebrew/var/mysql --tmpdir=/tmp
    mysql.server start
    mysql_secure_installation

Create `/etc/my.cnf` with the following contents:

    [mysqld]
      skip-networking

    [client]
      socket = /tmp/mysql.sock

    [server]
      socket = /tmp/mysql.sock

Restart mysqld:

    mysql.server restart

Further reading: <http://stackoverflow.com/questions/4359131/brew-install-mysql-on-mac-os>

## /etc/hosts ##

    sudo vi /etc/hosts

    # local development
    127.0.0.1  mysql


## phpMyAdmin ##

Download from <http://www.phpmyadmin.net/> and unzip.

    mkdir -p ~/Sites/mysql
    cd ~/Sites/mysql
    mv ~/Downloads/phpMyAdmin-* ./
    ln -s phpMyAdmin-* public
    cp config.sample.inc.php config.inc.php

Edit `config.inc.php` to contain the following:

``` php
/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'config';
/* Server parameters */
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['connect_type'] = 'socket';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '<password>';
```

## Ruby ##

[Use rbenv](https://github.com/sstephenson/rbenv)