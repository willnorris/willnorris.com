# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The post_tools plugins contains some extra utilities for working with posts.

require 'liquid'
require 'nokogiri'

module Jekyll
  class Post
    # Returns true if the current post is a draft.
    def draft?
      self.is_a?(Jekyll::Draft)
    end

    def to_liquid_with_draft(attrs = ATTRIBUTES_FOR_LIQUID)
      to_liquid_without_draft(attrs + %w[draft?])
    end
    alias_method :to_liquid_without_draft, :to_liquid
    alias_method :to_liquid, :to_liquid_with_draft
  end

  module PostToolsFilters
    # Strip HTML that matches selector from content.  For example, to output the
    # post content stripped of any <aside> tags, use:
    #
    #     {{ post.content | strip_tags: 'aside' }}
    #
    # selector can contain any string recognized by Nokogiri's css method.
    def strip_tags(content, selector)
      doc = Nokogiri::HTML.fragment(content)
      doc.css(selector).remove
      doc.inner_html
    end
  end
end

Liquid::Template.register_filter(Jekyll::PostToolsFilters)
