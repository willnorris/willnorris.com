require 'liquid'
require 'date'

module Jekyll
  class Post
    def datetime
      if !data.has_key?('datetime')
        data['datetime'] = DateTime.parse(data['date'].to_s)
      end
      data['datetime']
    end

    def to_liquid_with_datetime(attrs = ATTRIBUTES_FOR_LIQUID)
      to_liquid_without_datetime(attrs + %w[datetime])
    end
    alias_method :to_liquid_without_datetime, :to_liquid
    alias_method :to_liquid, :to_liquid_with_datetime
  end

  module DateFilters
    def datetime(input, format)
      return input if format.to_s.empty?
      return input unless date = to_datetime(input)

      format.gsub!('%o', ordinal(date.strftime('%e').to_i))
      format.gsub!('%:Z', timezone(date))

      date.strftime(format.to_s)
    end

    # Returns an ordinal number. 13 -> 13th, 21 -> 21st etc.
    def ordinal(input)
      if (11..13).include?(input.to_i % 100)
        "#{input}th"
      else
        case input.to_i % 10
        when 1 then "#{input}st"
        when 2 then "#{input}nd"
        when 3 then "#{input}rd"
        else        "#{input}th"
        end
      end
    end

    # this is pretty janky way of handling this and only works for the four
    # major US time zones
    def timezone(input)
      if Time.parse(input.to_s).isdst
        case input.zone
          when "-04:00" then "EDT"
          when "-05:00" then "CDT"
          when "-06:00" then "MDT"
          when "-07:00" then "PDT"
          else input.zone
        end
      else
        case input.zone
          when "-05:00" then "EST"
          when "-06:00" then "CST"
          when "-07:00" then "MST"
          when "-08:00" then "PST"
          else input.zone
        end
      end
    end

    def datetime_to_xmlschema(date)
      to_datetime(date).xmlschema
    end

    private
    def to_datetime(obj)
      return obj if obj.respond_to?(:strftime)

      case obj
      when 'now'.freeze, 'today'.freeze
        DateTime.now
      when /\A\d+\z/, Integer
        DateTime.at(obj.to_i)
      when String
        DateTime.parse(obj)
      else
        nil
      end
    rescue ArgumentError
      nil
    end
  end
end

Liquid::Template.register_filter(Jekyll::DateFilters)
