# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The datetime plugin includes extensions to jekyll posts and additional filters
# for working with dates.  Notably, jekyll heavily uses ruby Time objects which
# lose the specified timezone.  This plugin adds a post.datetime function which
# parses the front matter date variable as a ruby DateTime object.
#
# This plugin requires that post date fields be specified as quoted strings.
# Otherwise, the yaml module will attempt to parse "naked" values as a Time,
# which loses the specified timezone value.

require "date"

# Hook to populate the "datetime" data field for posts.
Jekyll::Hooks.register :posts, :pre_render do |post, data|
  page = data["page"]
  unless page["original_date"].kind_of? String
    Jekyll.logger.error "ERROR:", "datetime plugin requires that all dates be specified as strings"
    Jekyll.logger.error "", "#{@name} contains date of type '#{page["original_date"].class}'"
    exit(1)
  end
  page["datetime"] = DateTime.parse(page["original_date"].to_s)
end

module Jekyll
  class Document
    # monkey-patch merge_data in order to preserve the originally specified date value
    def merge_data_preserve_date!(other, source: "YAML front matter")
      data = merge_data_overwrite_datetime!(other, source: source)
      data["original_date"] = other["date"] if !other["date"].nil?
      data
    end
    alias_method :merge_data_overwrite_datetime!, :merge_data!
    alias_method :merge_data!, :merge_data_preserve_date!
  end

  module DateFilters
    # Format the provided timestamp.  This adds two formatting directives:
    #
    #  %o  - day of month as an ordinal day (e.g. "2nd", "23rd")
    #  %:Z - timezone as abbreviated name (e.g. "EDT", "PST").  Currently only
    #  supports continental US timezones.
    def datetime(input, format)
      return input if format.to_s.empty?
      return input unless date = to_datetime(input)

      format.gsub!("%o", ordinal(date.strftime("%e").to_i))
      format.gsub!("%:Z", timezone(date))

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
      when "now".freeze, "today".freeze
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
