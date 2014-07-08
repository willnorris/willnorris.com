---
title: Projects
---

# Projects


## wordpress
    mkdir -p ~/Projects/wordpress
    cd ~/Projects/wordpress

    svn co http://core.svn.wordpress.org/trunk wordpress-trunk
    svn co http://svn.automattic.com/wordpress-i18n/tools/trunk i18n-tools
    svn co http://svn.buddypress.org/trunk buddypress
    svn co http://svn.automattic.com/backpress/trunk backpress
    svn co http://svn.automattic.com/bbpress/trunk bbpress

## activity streams
    mkdir -p ~/Projects/activity-streams
    cd ~/Projects/activity-streams

    git clone git@github.com:activitystreams/activity-schema.git
    git clone git@github.com:activitystreams/atom-activity.git
    git clone git@github.com:activitystreams/website.git
    git clone git@github.com:apparentlymart/activity-streams-specs.git old-specs

## personal
    mkdir -p ~/Projects/personal
    cd ~/Projects/personal

    git clone git@github.com:willnorris/willnorris.github.com.git
    git clone git@github.com:willnorris/rootdir.git
    git clone git@github.com:willnorris/tidbits.git

## openid libraries
    mkdir -p ~/Projects/openid
    cd ~/Projects/openid

    git clone git@github.com:openid/php-openid.git
    git clone git@github.com:openid/php4-openid.git
    git clone git@github.com:openid/python-openid.git
    git clone git@github.com:openid/ruby-openid.git

## openid specs
    mkdir -p ~/Projects/specs/openid
    cd ~/Projects/specs/openid

    curl -L -o attribute-exchange-1_0.html http://openid.net/srv/ax/1.0
    curl -L -o authentication-1_1.html http://openid.net/signon/1.1
    curl -L -o authentication-2_0.html http://specs.openid.net/auth/2.0
    curl -L -o provider-authentication-policy-extension-1_0.html http://specs.openid.net/extensions/pape/1.0
    curl -L -o simple-registration-extension-1_0.html http://openid.net/extensions/sreg/1.0
    curl -L -o simple-registration-extension-1_1.html http://openid.net/extensions/sreg/1.1

## other specs
    mkdir -p ~/Projects/specs
    cd ~/Projects/specs

    svn co http://tools.oasis-open.org/version-control/svn/xri

