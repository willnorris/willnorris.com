# Copyright 2014 Google Inc. All rights reserved.
#
# Use of this source code is governed by the MIT
# license that can be found in the LICENSE file.

module Jekyll
  class Post
    # Ensure that all destination paths include an .html extension if needed.
    def destination_with_extension(dest)
      path = destination_without_extension(dest)
      path += ".html" if html? && path !~ /\.html$/
      path
    end

    alias_method :destination_without_extension, :destination
    alias_method :destination, :destination_with_extension

    def html?
      output_ext == ".html"
    end
  end

  class Document
    # Obtain destination path, appending file extension for documents that lack one.
    def destination_with_clean_urls(dest)
      path = destination_without_clean_urls(dest)
      ext = Jekyll::Renderer.new(site, self).output_ext
      if !(asset_file? || yaml_file?) && path !~ /#{ext}$/
        path += ext
      end
      path
    end

    alias_method :destination_without_clean_urls, :destination
    alias_method :destination, :destination_with_clean_urls
  end
end
