import { SPACE_TIMELINE } from '#lib/constants'
import { registerSpaceIdleTimeline } from '#pixi/space/timeline/idle'
import { SpaceObject } from '#pixi/types'
import { R } from '#utils/index'

interface CreateSpaceTimelinesProps {
  spaceObjects: SpaceObject[]
}

export const createSpaceTimelines = ({ spaceObjects }: CreateSpaceTimelinesProps) => {
  spaceObjects.forEach(object => {
    const { timelines } = object

    if (!timelines) {
      return
    }

    registerSpaceIdleTimeline({
      spaceObject: object,
      inDuration: R(10, 16),
      timeline: timelines[SPACE_TIMELINE.IDLE],
    })
  })

  const randomizeSpaceObjects = spaceObjects.sort(() => 0.5 - Math.random())
  let i = 0
  randomizeSpaceObjects.forEach(object => {
    if (object.timelines) {
      object.timelines[SPACE_TIMELINE.IDLE].play(-i * 5)
      i += 1
    }
  })

  return spaceObjects
}