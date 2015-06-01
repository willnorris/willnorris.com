---
title: Linode Instance
---

# Setting up a new Linode #

In early 2013, I switched to [Linode][] for hosting my personal websites.
These are the steps I generally follow to setup the server, mostly for my own
future reference.  This is basically an abbreviated form of the setup
instructions in the [Linode Library][], limited to Ubuntu instructions and with
a few additional steps I use.  Eventually, these should probably be convertd
into [chef][] or [puppet][] scripts.

[Linode]: https://www.linode.com
[Linode Library]: https://library.linode.com/
[chef]: http://www.opscode.com/chef/ 
[puppet]: https://puppetlabs.com/

## Setup machine ##

Basic machine setup, which applies to pretty much all servers, regardless of
what it's used for.

### Set hostname ###

    echo X.willnorris.net > /etc/hostname

Add the following to `/etc/hosts`:

    12.34.56.78 X.willnorris.net X
    2600:3c01::a123:b456:c789:d012 X.willnorris.net X

### Set timezone ###

    dpkg-reconfigure tzdata

### Update system software ###

    apt-get update
    apt-get upgrade --show-upgraded

Install some basic packages.  More packages get installed later, but here we
install the minimal packages needed for setting up my user account, as well as
some that I commonly use on all servers, regardless of their function.

    apt-get install zsh git tmux

### Setup user account ###

    adduser willnorris
    usermod -a -G sudo -s /usr/bin/zsh willnorris

Then setup account as normal, such as ssh keys and [homedir][].

[homedir]: https://github.com/willnorris/homedir-packages#readme

### Secure SSH ###

Edit `/etc/ssh/sshd_config` to reflect:

    PasswordAuthentication no
    PermitRootLogin no

Restart SSH:

    sudo service ssh restart

### Setup firewall ###

Check firewall rules:

    sudo iptables -L

Edit `/etc/iptables.firewall.rules` to contain:

    *filter

    #  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
    -A INPUT -i lo -j ACCEPT
    -A INPUT -d 127.0.0.0/8 -j REJECT

    #  Accept all established inbound connections
    -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

    #  Allow all outbound traffic - you can modify this to only allow certain traffic
    -A OUTPUT -j ACCEPT

    #  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
    -A INPUT -p tcp --dport 80 -j ACCEPT
    -A INPUT -p tcp --dport 443 -j ACCEPT

    #  Allow SSH connections
    #
    #  The -dport number should be the same port number you set in sshd_config
    #
    -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

    #  Allow ping
    -A INPUT -p icmp -j ACCEPT

    #  Log iptables denied calls
    -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

    #  Drop all other inbound - default deny unless explicitly allowed policy
    -A INPUT -j DROP
    -A FORWARD -j DROP

    COMMIT

Activate the firewall rules:

    sudo iptables-restore < /etc/iptables.firewall.rules

Ensure rules are activated on restart by editing `/etc/network/if-pre-up.d/firewall` to contain:

    #!/bin/sh
    /sbin/iptables-restore < /etc/iptables.firewall.rules

Make the file executable:

    sudo chmod +x /etc/network/if-pre-up.d/firewall

### Install fail2ban ###

    sudo apt-get install fail2ban

## Web Server ##

Install apache and php, and enable optional modules

    sudo apt-get install apache2 php5
    sudo a2enmod expires rewrite ssl

Update `/etc/apache2/apache2.conf` to reflect:

    <IfModule mpm_prefork_module>
        StartServers 2
        MinSpareServers 6
        MaxSpareServers 12
        MaxClients 30
        MaxRequestsPerChild 3000
    </IfModule>

Update `/etc/apache2/conf.d/security` to reflect:

    <DirectoryMatch "/\.(svn|git)">
        Order Deny,Allow
        Deny from all
    </DirectoryMatch>

Update `/etc/apache2/ports.conf` to reflect:

    <IfModule mod_ssl.c>
        NameVirtualHost *:443
        Listen 443
    </IfModule>

    <IfModule mod_gnutls.c>
        NameVirtualHost *:443
        Listen 443
    </IfModule>

Update `/etc/php5/apache/php.ini` to reflect:

    error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
    error_log = /var/log/php.log
    date.timezone = America/Los_Angeles

Create `/var/log/php.log`:

    sudo touch /var/log/php.log

### Configure Sites ###

Move document root of default site

    sudo mkdir -p /var/www/default/public
    sudo mv /var/www/index.html /var/www/default/public/

Update `/etc/apache2/sites-available/default` and
`/etc/apache2/sites-available/default-ssl` to reflect:

    DocumentRoot /var/www/default/public

    <Directory /var/www/default/public>
        ...
    </Directory>

Also update the `ServerAdmin` email address and remove the `ScriptAlias` for
`/cgi-bin/`.

Duplicate `default` and `default-ssl` as necessary for each site, making sure
to update the `ServerName`, `ServerAlias`, `DocumentRoot`, `ErrorLog`, and
`CustomLog` as appropriate.
