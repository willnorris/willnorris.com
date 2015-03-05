# Copyright 2014 Google. All rights reserved.
# Available under an MIT license that can be found in the LICENSE file.

# This plugin changes the destination for some static files in the 'content'
# directory.  If the source of the file matches 'content/[0-9]{4}' (that is,
# the 'content' directory, followed by a four-digit directory), then the
# 'content' prefix is removed from the destination.  For example:
#
#   {source}/content/2014/05/example.png  =>  {destination}/2014/05/example.png
#
# This is done so that images and other supporting files for posts will be output
# alongside the HTML file for the post, allowing for referencing files in the
# same directory.  For example:
#
#   <img src="example.png">
#
# Other files in the 'content' directory that are not in a four-digit directory
# are left as-is.

module Jekyll
  class StaticFile
    def destination(dest)
      dir = destination_rel_dir.sub(%r(^/content/(\d{4}(/|$))), '/\1')
      @site.in_dest_dir(*[dest, dir, @name].compact)
    end
  end
end
