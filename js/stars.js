;(function() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: -1;
    pointer-events: none;
  `
  document.body.insertBefore(canvas, document.body.firstChild)

  let W = canvas.width  = window.innerWidth
  let H = canvas.height = window.innerHeight
  let mouse = { x: W / 2, y: H / 2 }

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth
    H = canvas.height = window.innerHeight
    initStars()
  })

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  const STAR_COUNT = 130
  const COLORS = [
    'rgba(230,57,70,',
    'rgba(255,120,130,',
    'rgba(255,220,225,',
    'rgba(200,200,220,',
  ]

  let stars = []

  function initStars() {
    stars = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(makeStar(true))
    }
  }

  function makeStar(randomY = false) {
    const r = Math.random() * 1.6 + 0.4
    const colorIdx = Math.random() < 0.35 ? Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2)
    return {
      x:       Math.random() * W,
      y:       randomY ? Math.random() * H : -10,
      r,
      speed:   Math.random() * 0.25 + 0.08,
      drift:   (Math.random() - 0.5) * 0.25,
      color:   COLORS[colorIdx],
      opacity: Math.random() * 0.5 + 0.3,
      phase:   Math.random() * Math.PI * 2,
      freq:    Math.random() * 0.018 + 0.006,
    }
  }

  let frame = 0
  function draw() {
    ctx.clearRect(0, 0, W, H)
    frame++

    stars.forEach((s, i) => {

      const twink = Math.sin(frame * s.freq + s.phase) * 0.25
      const alpha = Math.max(0.05, Math.min(1, s.opacity + twink))

      const dx = s.x - mouse.x
      const dy = s.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 110) {
        const force = (110 - dist) / 110
        s.x += dx * force * 0.018
        s.y += dy * force * 0.018
      }

      s.y += s.speed
      s.x += s.drift + Math.sin(frame * 0.008 + s.phase) * 0.15

      if (s.y > H + 10) {
        stars[i] = makeStar(false)
        return
      }
      if (s.x < -10) s.x = W + 10
      if (s.x > W + 10) s.x = -10

      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5)
      glow.addColorStop(0,   s.color + (alpha * 0.9) + ')')
      glow.addColorStop(0.4, s.color + (alpha * 0.4) + ')')
      glow.addColorStop(1,   s.color + '0)')

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = s.color + alpha + ')'
      ctx.shadowColor = s.color + '0.6)'
      ctx.shadowBlur = s.r * 4
      ctx.fill()
      ctx.shadowBlur = 0
    })

    requestAnimationFrame(draw)
  }

  initStars()
  draw()
})()
