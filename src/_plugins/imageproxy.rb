# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The imageproxy plugin filters content, rewriting images to use an image proxy
# like https://willnorris.com/go/imageproxy.
#
# Specify the URL of the image proxy as 'imageproxy_baseurl' in the site config,
# then use the 'imageproxy' liquid block tag in templates.  <img> tags which
# include a height or width attribute will be rewritten to use the image proxy,
# resized to the proper dimension.
#
# Example:
#
#   (in _config.yml)
#   imageproxy_baseurl: http://i.example.com
#
#   (in post content)
#   <img src="http://example.com/image.jpg" width="200">
#
#   (in template)
#   {% imageproxy %}
#     {{ content }}
#   {% endimageproxy %}
#
#   (output)
#   <img src="http://i.example.com/200x/http://example.com/image.jpg" width="200">

require 'liquid'
require 'nokogiri'

module Jekyll
  class ImageProxyTag < Liquid::Block
    def render(context)
      content = super
      config = context.registers[:site].config
      return content unless config['url'] and config['imageproxy_baseurl']

      page_url = URI.join(config['url'], context['page']['url'])

      doc = Nokogiri::HTML.fragment(content)
      doc.search('.//img').each do |i|
        img_url = URI.join(page_url, i.attributes['src'])
        width = i.attributes['width']
        height = i.attributes['height']
        if "#{img_url}".start_with?(config['url']) and (width or height)
          proxy_url = config['imageproxy_baseurl'] + "/#{width}x#{height}/#{img_url}"
          i.attributes['src'].value = proxy_url
        end
      end
      doc.inner_html
    end
  end
end

Liquid::Template.register_tag('imageproxy', Jekyll::ImageProxyTag)
