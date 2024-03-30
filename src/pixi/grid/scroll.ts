import gsap from 'gsap'

import { getStore } from '#pixi/store'
import { Tile } from '#pixi/types'
import { TILE_TIMELINE } from '#src/lib/constants'
import { R } from '#src/utils'

let lastScrollTop = document.documentElement.scrollTop || window.scrollY
let lastScrollDirection = ''

const getAllActiveTiles = () => {
  const { tiles } = getStore()
  const activeTileIds: Tile[] = []
  tiles.forEach(tile => {
    if (tile.timelines) {
      Object.values(tile.timelines).forEach(timeline => {
        if (timeline.isActive()) {
          activeTileIds.push(tile)
        }
      })
    }
  })
  return activeTileIds
}

const animateScroll = (direction: string) => {
  const activeTiles = getAllActiveTiles()
  activeTiles.forEach(tile => {
    if (!tile.timelines) return

    tile.timelines[TILE_TIMELINE.HOVER_OUT].pause()
    tile.timelines[TILE_TIMELINE.HITBOX_OUT].pause()
    tile.timelines[TILE_TIMELINE.HOVER_IN].pause()
    tile.timelines[TILE_TIMELINE.HITBOX_IN].pause()

    gsap.to(tile.container, {
      duration: 1,
      y: direction === 'down' ? `-=${R(60, 600)}` : `+=${R(60, 600)}`,
      alpha: 0,
      ease: 'power1.out',
    })
    gsap.to(tile.sprite, {
      duration: 1,
      rotation: (R(-60, 60) * Math.PI) / 180,
      alpha: 0,
      ease: 'power1.out',
    })
    gsap.to(tile.container.scale, {
      duration: 1,
      x: 0,
      y: 0,
      ease: 'power1.out',
    })
  })
}

export const handleScroll = () => {
  const st = window.scrollY || document.documentElement.scrollTop || window.pageYOffset

  if (st > lastScrollTop && lastScrollDirection !== 'down') {
    animateScroll('down')
    lastScrollDirection = 'down'
  } else if (st < lastScrollTop && lastScrollDirection !== 'up') {
    animateScroll('up')
    lastScrollDirection = 'up'
  }

  lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling
}
