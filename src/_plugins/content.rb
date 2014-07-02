module Jekyll
  class StaticFile
    def destination(dest)
      dir = @dir.sub(/^\/content\/([0-9]{4})/, '/\1')
      File.join(*[dest, dir, @name].compact)
    end
  end
end
