# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# The drafts plugins contains some extra utilities for working with draft
# posts.

module Jekyll
  class Post
    # Returns true if the current post is a draft.
    def is_draft
      self.kind_of? Jekyll::Draft
    end

    def to_liquid_with_draft(attrs = ATTRIBUTES_FOR_LIQUID)
      to_liquid_without_draft(attrs + %w[is_draft])
    end
    alias_method :to_liquid_without_draft, :to_liquid
    alias_method :to_liquid, :to_liquid_with_draft
  end
end
