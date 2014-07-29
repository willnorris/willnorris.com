require 'liquid'
require 'date'

module Jekyll
  class Post
    attr_accessor :datetime

    def initialize_with_datetime(site, source, dir, name)
      initialize_without_datetime(site, source, dir, name)
      if data.has_key?('date')
        self.datetime = DateTime.parse(data['date'].to_s)
        data['datetime'] = datetime
      end
    end
    alias_method :initialize_without_datetime, :initialize
    alias_method :initialize, :initialize_with_datetime
  end

  class PostDateTag < Liquid::Tag
    def render(context)
      dt = context['page']['datetime']
      dt.strftime("%B %-d") + ordinal(dt.strftime("%-d")) \
        + dt.strftime(", %Y at %-I:%M %p ").downcase + timezone(dt)
    end

    def ordinal(day)
      case day
        when "1", "21", "31" then "st"
        when "2", "22" then "nd"
        when "3", "23" then "rd"
        else "th"
      end
    end

    # this is pretty janky way of handling this and only works for the four
    # major US time zones
    def timezone(date)
      if Time.parse(date.to_s).isdst
        case date.zone
          when "-04:00" then "EDT"
          when "-05:00" then "CDT"
          when "-06:00" then "MDT"
          when "-07:00" then "PDT"
          else date.zone
        end
      else
        case date.zone
          when "-05:00" then "EST"
          when "-06:00" then "CST"
          when "-07:00" then "MST"
          when "-08:00" then "PST"
          else date.zone
        end
      end
    end
  end
end

Liquid::Template.register_tag('post_datetime', Jekyll::PostDateTag)
