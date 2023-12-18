import { APP_CONFIG, TILE_CONFIG } from '@/lib/constants'
import { getRandom } from '@/lib/utils'
import { Sprite } from 'pixi.js'
import gsap from 'gsap'
import { TileBase } from '@/components/Tile/tiles'
import { useCallback, useMemo } from 'react'

interface useTileFxProps {
  tiles: TileBase[]
}

const useTileFx = ({ tiles }: useTileFxProps) => {
  const predefinedFXInitial = useMemo(
    () =>
      tiles.map(tile => ({
        skewX: getRandom(-50, 50),
        skewY: getRandom(-50, 50),
        rotation: getRandom(-50, 50),
        tint: '#fff200',
        alpha: 0,
        width: 0,
        height: 0,
        x: tile.x + getRandom(-TILE_CONFIG.width * 1.2, TILE_CONFIG.width * 1.2),
        y: tile.y + getRandom(-TILE_CONFIG.height * 1.2, TILE_CONFIG.height * 1.2),
      })),
    [tiles],
  )

  const predefinedFXIn = useMemo(
    () =>
      tiles.map(tile => ({
        tint: '#ff0000',
        skewX: getRandom(-10, 10),
        skewY: getRandom(-10, 10),
        width: TILE_CONFIG.width * getRandom(1.1, 1.3),
        height: TILE_CONFIG.height * getRandom(1.1, 1.3),
        x: tile.x,
        y: tile.y,
      })),
    [tiles],
  )

  const setupGsapTile = useCallback(
    (tile: Sprite, id: number) => {
      gsap.killTweensOf(tile) // for perfomance do not kill tweens
      gsap.set(tile, {
        pixi: {
          ...predefinedFXInitial[id],
        },
      })
    },
    [predefinedFXInitial],
  )

  const animateOut = useCallback(
    (tile: Sprite, id: number, originX: number, originY: number) => {
      // gsap.killTweensOf(tile) // for perfomance do not kill tweens

      gsap.to(tile, {
        duration: getRandom(0.4, 0.5),
        pixi: {
          width: 0,
          height: 0,
          tint: '#3f2222',
          rotation: getRandom(-150, 150),
          skewX: getRandom(-150, 150),
          skewY: getRandom(-150, 150),
          x:
            originX +
            getRandom(
              -TILE_CONFIG.width * (APP_CONFIG.hoverCircleCount * 1.5),
              TILE_CONFIG.width * (APP_CONFIG.hoverCircleCount * 1.5),
            ),
          y:
            originY +
            getRandom(
              -TILE_CONFIG.height * (APP_CONFIG.hoverCircleCount * 1.5),
              TILE_CONFIG.height * (APP_CONFIG.hoverCircleCount * 1.5),
            ),
        },
        onComplete: () => {
          setupGsapTile(tile, id)
        },
      })
    },
    [setupGsapTile],
  )

  const animateIn = useCallback(
    (tile: Sprite, id: number, originX: number, originY: number) => {
      gsap.killTweensOf(tile)

      const tl = gsap.timeline()
      tl.to(tile, {
        duration: getRandom(0.1, 0.2),
        pixi: {
          ...predefinedFXIn[id],
          alpha: getRandom(0.5, 1),
          rotation: getRandom(-30, 30),
        },
      })
      tl.to(tile, {
        duration: getRandom(0.3, 0.4),
        pixi: {
          x:
            originX +
            getRandom(
              -TILE_CONFIG.width * APP_CONFIG.hoverCircleCount,
              TILE_CONFIG.width * APP_CONFIG.hoverCircleCount,
            ),
          y:
            originY +
            getRandom(
              -TILE_CONFIG.height * APP_CONFIG.hoverCircleCount,
              TILE_CONFIG.height * APP_CONFIG.hoverCircleCount,
            ),
          tint: '#ff9000',
          rotation: getRandom(-30, 30),
          skewX: getRandom(-40, 40),
          skewY: getRandom(-50, 50),
          width: TILE_CONFIG.width / getRandom(1.2, 1.5),
          height: TILE_CONFIG.height / getRandom(1.2, 1.5),
        },
        onComplete: () => {
          animateOut(tile, id, originX, originY)
        },
      })
    },
    [animateOut, predefinedFXIn],
  )

  return {
    setupGsapTile,
    predefinedFXIn,
    animateIn,
  }
}

export default useTileFx
