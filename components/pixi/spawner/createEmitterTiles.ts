import gsap from 'gsap'
import { Application, Texture } from 'pixi.js'

import { EMITTER_TIMELINE, PixiConfig } from '#lib/constants'
import { createContainer } from '#pixi/system/createContainer'
import createIconBaseTextures from '#pixi/system/createIconBaseTexture'
import { createSprite } from '#pixi/system/createSprite'
import { EmitterTile } from '#pixi/types'
import { R } from '#pixi/utils'

const addEmitterTimelines = () => ({
  [EMITTER_TIMELINE.DEFAULT]: gsap.timeline({
    paused: true,
    autoRemoveChildren: true,
    repeatRefresh: true,
  }),
})

// todo: redundant to createTileGrid -> refactor to be a single function
// needs count and size as arguments - rely on constants mainly!
const createEmitterTiles = (app: Application, tileSize: number) => {
  const tilesPos: EmitterTile[] = []

  // todo: constants
  const emitterCount = 3000

  const baseTextures = createIconBaseTextures(app, tileSize / 2, PixiConfig.configEmitterIcons)

  let tileId = 0
  for (let i = 0; i < emitterCount; i += 1) {
    const container = createContainer({
      x: app.renderer.width / 2,
      y: app.renderer.height / 2,
      zIndex: R(5, 10),
    })

    const innerContainer = createContainer({
      x: 0,
      y: 0,
    })

    const randomBaseTexture = baseTextures[Math.floor(Math.random() * baseTextures.length)]
    const clonedTexture = Texture.from(randomBaseTexture)

    const sprite = createSprite({
      texture: clonedTexture,
      width: tileSize,
      height: tileSize,
      alpha: 0,
    })

    const tile: EmitterTile = {
      id: (tileId += 1),
      sprite,
      container,
      innerContainer,
      timelines: addEmitterTimelines(),
    }

    app.stage.addChild(container)
    container.addChild(innerContainer)
    innerContainer.addChild(sprite)
    tilesPos.push(tile)
  }

  return tilesPos
}

export default createEmitterTiles