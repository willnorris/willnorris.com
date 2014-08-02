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
