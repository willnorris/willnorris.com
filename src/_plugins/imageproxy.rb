# encoding: utf-8
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
