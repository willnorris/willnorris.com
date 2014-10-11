# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The syndication plugin provides support for linking to syndicated copies of a
# post.  Specify the URLs of syndicated copies of the post in the 'syndication'
# variable in the post front matter.  These links will be available in templates
# as 'post.syndication_links'.  The filter 'syndication_title' will provide a
# human readable title for URLs on common sites, defaulting to the site domain.
#
# The 'post.syndication_links' property will only include syndication links that
# include a URL path.  Links without a path are expected to mean *intended*
# syndicated posts.  Templates can use 'post.bridgy_links' to return brid.gy
# POSSE webmention links for services supported by brid.gy (read more at
# https://www.brid.gy/about#publishing).  After the post has been POSSE'd
# out, just update the syndication link with the final URL.
#
# Example:
#
#   (in post front matter)
#   syndication:
#    - https://twitter.com/willnorris/status/497774634238885888
#
#   (in template)
#   {% for syn in page.syndication_links %}
#     <a rel="syndication" class="u-syndication"
#       href="{{ syn }}">{{ syn | syndication_title }}</a>
#   {% endfor %}

require 'liquid'

module Jekyll
  class Post
    def syndication_links
      return unless data.has_key?('syndication')
      Array(data['syndication']).select do |syn|
        uri = URI(syn)
        uri.path.length > 0 && uri.path != "/"
      end
    end

    def bridgy_links
      return unless data.has_key?('syndication')
      links = []
      Array(data['syndication']).each do |syn|
        uri = URI(syn)
        next if uri.path.length > 0 && uri.path != "/"
        case uri.host
        when 'facebook.com', 'www.facebook.com'
          links.push('https://www.brid.gy/publish/facebook')
        when 'twitter.com', 'www.twitter.com'
          links.push('https://www.brid.gy/publish/twitter')
        end
      end
      return links
    end

    def to_liquid_with_syndication(attrs = ATTRIBUTES_FOR_LIQUID)
      to_liquid_without_syndication(attrs + %w[syndication_links bridgy_links])
    end
    alias_method :to_liquid_without_syndication, :to_liquid
    alias_method :to_liquid, :to_liquid_with_syndication
  end

  module Syndication
    # Get title for syndication URL.
    def syndication_title(url)
      uri = URI(url)
      case uri.host
      when 'facebook.com', 'www.facebook.com'
        'Facebook'
      when 'github.com', 'www.github.com'
        'GitHub'
      when 'news.ycombinator.com'
        'Hacker News'
      when 'plus.google.com'
        'Google+'
      when 'reddit.com', 'www.reddit.com'
        p = uri.path.split('/')
        if p[1] == 'r'
          p[0,3].join('/')
        else
          'Reddit'
        end
      when 'twitter.com', 'www.twitter.com'
        'Twitter'
      else
        uri.host
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::Syndication)
