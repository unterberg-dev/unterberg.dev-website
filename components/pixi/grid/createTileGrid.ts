import gsap from 'gsap'
import { Application, Texture } from 'pixi.js'

import { createContainer } from '#components/pixi/system/createContainer'
import { createSprite } from '#components/pixi/system/createSprite'
import createIconBaseTextures from '#pixi/system/createIconBaseTexture'
import { Tile } from '#pixi/types'
import { R } from '#pixi/utils'
import { IDLE_TILE_TIMELINE, PixiConfig } from '#root/lib/constants'

const addTileTimelines = () => ({
  [IDLE_TILE_TIMELINE.DEFAULT]: gsap.timeline({
    repeat: -1,
    yoyo: true,
    delay: R(0, 10.1),
    repeatDelay: R(4, 8),
    paused: true,
  }),
})

export const createTileGrid = (app: Application, gridSize: number) => {
  const tilesPos: Tile[] = []

  const baseTextures = createIconBaseTextures(app, gridSize, PixiConfig.configTileIcons)

  let tileId = 0

  for (let y = 0; y < app.renderer.height; y += gridSize) {
    for (let x = 0; x < app.renderer.width; x += gridSize) {
      const container = createContainer({
        x,
        y,
        zIndex: R(1, 5),
      })

      const innerContainer = createContainer({
        x: 0,
        y: 0,
      })

      const randomBaseTexture = baseTextures[Math.floor(Math.random() * baseTextures.length)]
      const clonedTexture = Texture.from(randomBaseTexture)

      const sprite = createSprite({
        texture: clonedTexture,
        width: clonedTexture.width,
        height: clonedTexture.height,
      })

      const tile: Tile = {
        id: (tileId += 1),
        x,
        y,
        sprite,
        container,
        innerContainer,
        timelines: addTileTimelines(),
      }

      app.stage.addChild(container)
      container.addChild(innerContainer)
      innerContainer.addChild(sprite)
      tilesPos.push(tile)
    }
  }

  return tilesPos
}