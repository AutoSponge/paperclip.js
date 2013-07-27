
class ClipBinding extends require("./base")

  ###
  ###

  constructor: (@clip) ->

  ###
  ###

  load: (@context) ->
    @clip.reset context

  ###
  ###

  bind: () ->
    @clip.watch()

  ###
  ###

  unbind: () ->
    @clip.unwatch()

module.exports = ClipBinding