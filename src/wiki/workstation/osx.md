---
title: OS X Workstation
---

# Setting up OS X #


## Host Configuration ##

Set the Computer Name in the OS X Sharing Preference Pane.  If necessary, also
configure a custom hostname by adding the following to `/etc/hostconfig`:

    HOSTNAME=<hostname>

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

    brew install coreutils dos2unix git grc hub pngcrush

Additional packages that may or may not be relevant:

    brew install google-app-engine mercurial synergy


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

## Apache ##

Turn on 'Web Sharing' in the Sharing preference pane.  
Edit `/etc/apache2/httpd.conf` with the following changes:

 - edit: `Listen 127.0.0.1:80`
 - uncomment: `LoadModule php5_module libexec/apache2/libphp5.so`
 - uncomment: `Include /private/etc/apache2/extra/httpd-vhosts.conf`

Edit `/etc/apache2/extra/httpd-vhosts.conf` with the following changes:

 - comment out all `<VirtualHost>` sections
 - add the following line to the end

`VirtualDocumentRoot /Users/willnorris/Sites/%0/public/`

Alternately, if using \*.dev or similar hostnames, use the following virtual document root:

`VirtualDocumentRoot /Users/willnorris/Sites/%-2+/public/`

Edit `/etc/apache2/users/willnorris.conf` with the following changes:

 - edit: `Options Indexes MultiViews FollowSymLinks`
 - edit: `AllowOverride All`
 - add duplicate `<Directory>` section for "/Users/willnorris/Projects/"

Restart apache:

    sudo apachectl restart

Create site for `localhost`:

    mkdir -p ~/Sites/localhost/public
    echo '<?php phpinfo(); ?>' > ~/Sites/localhost/public/info.php


## PHP ##

    sudo cp /etc/php.ini.default /etc/php.ini
    sudo touch /var/log/php.log
    sudo chown www /var/log/php.log

Edit `/etc/php.ini` with the following changes:

 - edit: `date.timezone = 'America/Los_Angeles'`
 - edit: `mysql.default_socket = /tmp/mysql.sock`
 - edit: `mysqli.default_socket = /tmp/mysql.sock`
 - edit: `pdo_mysql.default_socket = /tmp/mysql.sock`
 - add: `error_log = /var/log/php.log`

Restart apache:

    sudo apachectl restart

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

## Miscellaneous ##

### Python Packages ###

    sudo easy_install pip
    sudo pip install octogit tox

### Ruby Gems ###

    sudo gem update --system
    sudo gem install compass --pre
    sudo gem install jekyll maruku
