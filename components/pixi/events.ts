import { initAutoPointer } from '#components/pixi/autoPointer'
import { handlePointerMove } from '#components/pixi/grid/pointer'
import { handleUpdateHitboxes } from '#components/pixi/grid/timeline/hitbox'
import { getStore } from '#components/pixi/store'

// todo: little game - after 50000px crazy things happen :D
// todo: outsource to rocket launch
// let totalDistance = 0
// const lastSeenAt = { x: 0, y: 0 }
// const handleMoveToRocketLaunch = (event: MouseEvent) => {
//   if (lastSeenAt.x) {
//     totalDistance += Math.sqrt(
//       Math.pow(lastSeenAt.y - event.clientY, 2) + Math.pow(lastSeenAt.x - event.clientX, 2),
//     )

//     if (totalDistance > 50000) {
//       // trigger rocket launch hereeeeee

//       // cleanup
//       window.removeEventListener('pointermove', handleMoveToRocketLaunch)
//     }
//   }
//   lastSeenAt.x = event.clientX
//   lastSeenAt.y = event.clientY
// }

const triggerPointerStopped = (event: PointerEvent) => {
  const { autoPointerTimeline } = getStore()
  if (!autoPointerTimeline) return

  initAutoPointer({
    x: event.clientX,
    y: event.clientY,
    width: 60,
    height: 60,
    duration: 0.04,
  })
}

const triggerPointerStarted = () => {
  const { autoPointerTimeline } = getStore()
  autoPointerTimeline?.pause()
}

let pointerStarted = false
let windowPointerMoveTimer: NodeJS.Timeout
const pointerDetectionTiming = 200

export const initUserEvents = () => {
  window.addEventListener('pointermove', event => {
    clearTimeout(windowPointerMoveTimer)

    if (!pointerStarted) {
      triggerPointerStarted()
      pointerStarted = true
    }
    windowPointerMoveTimer = setTimeout(() => {
      triggerPointerStopped(event)
      pointerStarted = false
    }, pointerDetectionTiming)
  })

  window.addEventListener('pointermove', event => handlePointerMove({ event }))
  window.addEventListener('scrollend', handleUpdateHitboxes)

  // todo:
  // window.addEventListener('pointermove', handleMoveToRocketLaunch)

  // WIP
  // window.addEventListener('scroll', handleScroll)
}