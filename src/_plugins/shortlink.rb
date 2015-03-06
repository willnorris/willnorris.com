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

      links = links.uniq

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
