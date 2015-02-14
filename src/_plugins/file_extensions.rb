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
end
