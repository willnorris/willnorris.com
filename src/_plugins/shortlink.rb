# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The shortlink plugins adds short URLs for content.
#
# The added 'shortlink' liquid tag will output a <link rel="shortlink"> element
# containing the shortlink(s) for the current post.  Shortlinks are defined in
# 'shortlink' property in the post's front matter.  These shortlink values can
# be absolute or relative URLs; if relative, they will be resolved relative to
# the 'short_baseurl' value in the site config if present, falling back to the
# 'url' config value.
#
# If multiple shortlink values are listed for a post, the first value will be
# included in the href attribute of the <link> element.  Any additional values
# will be included as a space-separated list in the 'data-alt-href' attribute.
#
# Example:
#
#   (in _config.yml)
#   short_baseurl: http://x.com
#
#   (in post front matter)
#   shortlink: /t123
#
#   (in template)
#   {% shortlink %}
#
#   (output)
#   <link rel="shortlink" href="http://x.com/t123">

require "date"
require "time"
require "nokogiri"

module Jekyll
  class ShortlinkTag < Liquid::Tag
    def render(context)
      config = context.registers[:site].config
      base = config.has_key?("short_baseurl") ? config["short_baseurl"] : config["url"]

      links = []
      Array(context["page"]["shortlink"]).each do |link|
        links << URI.join(base, link)
      end

      # TODO: generate and add date-based shortlink

      # old WordPress links
      wordpress_id = context["page"]["wordpress_id"]
      if wordpress_id
        links << URI.join(base, "/b/#{wordpress_id.to_sxg}")
        links << URI.join(base, "/p/#{wordpress_id}")
      end

      unless links.empty?
        # TODO: there must be a better way to do this
        doc = Nokogiri::HTML::DocumentFragment.parse "<link>"
        link = doc.at_css "link"
        link["rel"] = "shortlink"
        link["href"] = links.shift
        unless links.empty?
          link["data-alt-href"] = links.join(" ")
        end
        doc.to_html
      end
    end
  end
end

Liquid::Template.register_tag("shortlink", Jekyll::ShortlinkTag)

# NewBase60 implementation by Shane Becker and friends (https://github.com/veganstraightedge/new_base_60)
# Released under CC0 (Public Domain).
class NewBase60
  VERSION    = "1.1.2"
  VOCABULARY = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz"

  def initialize(base_60)
    @base_60 = base_60
  end

  def to_s
    @base_60
  end

  # Converts into a base 10 integer.
  def to_i
    num = 0

    @base_60.bytes do |char|
      case char
      when 48..57   then char -= 48
      when 65..72   then char -= 55
      when 73, 108  then char  = 1  # typo capital I, lowercase l to 1
      when 74..78   then char -= 56
      when 79       then char  = 0  # error correct typo capital O to 0
      when 80..90   then char -= 57
      when 95       then char  = 34
      when 97..107  then char -= 62
      when 109..122 then char -= 63
      else               char  = 0  # treat all other noise as 0
      end

      num = 60 * num + char
    end

    num
  end

  # Converts into a Date.
  def to_date
    Time.at(to_i * 60 * 60 * 24).utc.to_date
  end
end

class Integer
  # Converts a base 10 integer into a NewBase60 string.
  def to_sxg
    return "" if zero?

    num = self
    sxg = ""

    while num > 0 do
      mod = num % 60
      sxg = "#{NewBase60::VOCABULARY[mod,1]}#{sxg}"
      num = (num - mod) / 60
    end

    sxg
  end

  # Converts a base 10 integer into a NewBase60 string,
  # padding with leading zeroes.
  def to_sxgf(padding=1)
    str = to_sxg

    padding -= str.length

    padding.times.map { "0" }.join + str
  end
end

class Date
  # Converts into a NewBase60 string.
  def to_sxg
    (self - Date.parse("1970/01/01")).to_i.to_sxg
  end
end
