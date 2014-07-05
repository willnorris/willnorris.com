module Jekyll
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
