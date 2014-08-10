# The imageproxy plugin filters post content, rewriting images to use an image
# proxy like https://willnorris.com/go/imageproxy.
#
# Specify the URL of the image proxy as 'imageproxy_baseurl' in the site config,
# then use the 'proxied_content' liquid tag in templates.  <img> tags which
# include a height or width attribute will be rewritten to use the image proxy,
# resized to the proper dimension.

require 'liquid'
require 'nokogiri'

module Jekyll
  class ImageProxyTag < Liquid::Tag
    def render(context)
      config = context.registers[:site].config
      return context['content'] unless config['url'] and config['imageproxy_baseurl']

      page_url = URI.join(config['url'], context['page']['url'])

      doc = Nokogiri::HTML.fragment(context['content'])
      doc.search('.//img').each do |i|
        img_url = URI.join(page_url, i.attributes['src'])
        width = i.attributes['width']
        height = i.attributes['height']
        if "#{img_url}".start_with?(config['url']) and (width or height)
          next if img_url.to_s.end_with?('.svg') # don't proxy svg images
          proxy_url = config['imageproxy_baseurl'] + "/#{width}x#{height}/#{img_url}"
          i.attributes['src'].value = proxy_url
        end
      end
      doc.inner_html
    end
  end
end

Liquid::Template.register_tag('proxied_content', Jekyll::ImageProxyTag)
