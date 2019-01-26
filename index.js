var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

var dots = []
var dotCounter = 0
var mouseX, mouseY

var impact = 5
var gap = 60
var amountX = 20
var minMargin = 100
var buttons = [
  {
    x: 4, y: 5, color: 'blue'
  }
]

var amountY, marginY, width, height, marginX

function reset () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  width = amountX * gap
  marginX = (canvas.width - width) / 2
  amountY = Math.floor((canvas.height - minMargin * 2) / gap)
  height = amountY * gap
  marginY = (canvas.height - height) / 2
  amountX++
  amountY++

  dots.length = 0
  dotCounter = 0
  for (var x = 0; x <= amountX; x++) {
    dots[x] = []
    for (var y = 0; y <= amountY; y++) {
      var posX = marginX + gap * x
      var posY = marginY + gap * y
      dots[x][y] = {
        originX: posX,
        originY: posY,
        x: posX,
        y: posY,
        targetX: posX,
        targetY: posY,
        id: dotCounter++
      }
    }
  }
}

function updateDot (dot) {
  if (mouseX === undefined || mouseY === undefined) {
    return
  }

  var dX, dY
  if (
    mouseX < marginX ||
    mouseX > canvas.width - marginX ||
    mouseY < marginY ||
    mouseY > canvas.height - marginY
  ) {
    dot.targetX = dot.originX
    dot.targetY = dot.originY
  } else {
    dX = dot.originX - mouseX
    dY = dot.originY - mouseY
    var len = Math.sqrt(dX * dX + dY * dY)
    dot.targetX = dot.originX + dX / len * gap * impact
    dot.targetY = dot.originY + dY / len * gap * impact
  }

  dX = dot.targetX - dot.x
  dY = dot.targetY - dot.y
  len = Math.sqrt(dX * dX + dY * dY)
  if (len > 1) {
    dot.x += dX / 10
    dot.y += dY / 10
  } else {
    dot.x = dot.targetX
    dot.y = dot.targetY
  }
}

function loop () {
  window.requestAnimationFrame(loop)

  ctx.fillStyle = '#eee'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Render
  var x, y

  for (x = 0; x < amountX; x++) {
    for (y = 0; y < amountY; y++) {
      updateDot(dots[x][y])
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i]
    if (button.x < amountX && button.y < amountY) {
      var p1 = dots[button.x][button.y]
      var p2 = dots[button.x + 1][button.y]
      var p3 = dots[button.x + 1][button.y + 1]
      var p4 = dots[button.x][button.y + 1]

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.lineTo(p4.x, p4.y)
      ctx.fillStyle = button.color
      ctx.fill()
    }
  }

  // Vertical
  ctx.beginPath()
  for (x = 0; x < amountX; x++) {
    ctx.moveTo(dots[x][0].x, dots[x][0].y)
    for (y = 0; y < amountY; y++) {
      ctx.lineTo(dots[x][y].x, dots[x][y].y)
    }
  }
  ctx.stroke()

  // Horizontal
  ctx.beginPath()
  for (y = 0; y < amountY; y++) {
    ctx.moveTo(dots[0][y].x, dots[0][y].y)
    for (x = 0; x < amountX; x++) {
      ctx.lineTo(dots[x][y].x, dots[x][y].y)
    }
  }
  ctx.stroke()
}

window.addEventListener('mousemove', function (e) {
  mouseX = e.clientX
  mouseY = e.clientY
})

window.addEventListener('resize', reset)

reset()
loop()
