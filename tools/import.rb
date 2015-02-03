#!/usr/bin/env ruby

$: << '/Users/willnorris/Projects/jekyll/lib'
$: << '/Users/willnorris/Projects/jekyll-import/lib'

require "jekyll-import";
require_relative "local";

# ./local.rb contains:
#
# @config = {
#     "socket"         => "/tmp/mysql.sock",
#     "dbname"         => "...",
#     "user"           => "...",
#     "password"       => "...",
#     "prefix"         => "...",
# }

JekyllImport::Importers::WordPress.run({
    "clean_entities" => false,
    "comments"       => false,
    "categories"     => true,
    "tags"           => true,
    "more_excerpt"   => false,
    "more_anchor"    => false,
    #"status"         => ["publish"]
    "status"         => ["publish", "draft"]
}.merge(@config))
