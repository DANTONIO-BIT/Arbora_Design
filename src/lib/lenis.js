import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let instance = null
let tickerFn  = null

export const initLenis = () => {
  if (instance) return instance

  instance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  instance.on('scroll', ScrollTrigger.update)

  // Keep a reference so we can remove it precisely on destroy.
  // The optional-chain on instance guards against any edge-case race.
  tickerFn = (time) => instance?.raf(time * 1000)

  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  return instance
}

export const getLenis = () => instance

export const destroyLenis = () => {
  // Remove from ticker BEFORE nulling instance to prevent null.raf() crash
  if (tickerFn) {
    gsap.ticker.remove(tickerFn)
    tickerFn = null
  }
  if (instance) {
    instance.destroy()
    instance = null
  }
}
