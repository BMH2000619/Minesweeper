const main = document.querySelector('main')
const reset = document.querySelector('.reset')
let cells = []
const mineCount = 10
const width = 10
let count = 0
let score = document.querySelector('p')
let gameOver = false
let turn = 0
let turns = document.querySelector('a')
const time = document.querySelector('section')
let timer = 0
let timerId

// Creates the board on the page filled with 10 x 10 cells
const boardCreate = () => {
  main.innerHTML = ''
  cells = []

  // Mines on the board
  const mines = []
  for (let i = 0; i < mineCount; i++) {
    mines.push('mine')
  }

  // Safe cells on the board
  const safes = []
  for (let i = 0; i < width * width - mineCount; i++) {
    safes.push('safe')
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // sort() sorts the array, Math.random() makes it randomize the array, and -0.5 makes sorting more random ensuring equal chance with results
  const game = [...mines, ...safes].sort(() => Math.random() - 0.5)

  game.forEach((type, i) => {
    const cell = document.createElement('div')
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
    cell.setAttribute('data-id', i)
    cell.classList.add('size-of-cells')

    if (type === 'mine') cell.dataset.mine = 'true'

    cell.addEventListener('click', () => {
      handleClick(cell)
    })

    // https://stackoverflow.com/questions/28790209/attaching-an-event-listener-for-left-or-right-click-onclick-doesnt-work-for-r
    cell.addEventListener('contextmenu', (e) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
      e.preventDefault()
      toggleFlag(cell)
    })

    main.appendChild(cell)
    cells.push(cell)
  })
  calcNumbers()
  timerId = setInterval(setTimer, 1000)
}

const calcNumbers = () => {
  for (let i = 0; i < cells.length; i++) {
    const isLeftEdge = i % width === 0
    const isRightEdge = i % width === width - 1

    if (cells[i].dataset.mine === 'true') {
      continue
    }

    // Checks if there is a bomb on any side and calculate the number it should show on the cell
    const adjacent = []
    // Checks top
    if (i >= width) {
      adjacent.push(i - width)
    }
    // Checks Bottom
    if (i < width * (width - 1)) {
      adjacent.push(i + width)
    }
    // Checks Left
    if (!isLeftEdge) {
      adjacent.push(i - 1)
    }
    // Checks Right
    if (!isRightEdge) {
      adjacent.push(i + 1)
    }
    // Check Top-Left
    if (i >= width && !isLeftEdge) {
      adjacent.push(i - width - 1)
    }
    // Checks Top-Right
    if (i >= width && !isRightEdge) {
      adjacent.push(i - width + 1)
    }
    // Checks Bottom-left
    if (i < width * (width - 1) && !isLeftEdge) {
      adjacent.push(i + width - 1)
    }
    // Checks Bottom-Right
    if (i < width * (width - 1) && !isRightEdge) {
      adjacent.push(i + width + 1)
    }

    // Filters out Adjacent Cells that are mines
    const validAdjacent = adjacent.filter(
      (n) => cells[n] && cells[n].dataset.mine === 'true'
    )

    // Stores Adjacent mines count in the datasets
    cells[i].dataset.number = validAdjacent.length
  }
}

// decides what does the click do, if flag do nothing and if mine its game over
let handleClick = (cell) => {
  if (gameOver || cell.classList.contains('flag')) {
    return
  }

  if (cell.dataset.mine === 'true') {
    cell.classList.add('mine')
    alert('YOU DIED HAHAHAHAHA!')
    // https://stackoverflow.com/questions/9419263/how-to-play-audio
    const audio = new Audio('./audio/laugh.mp3')
    audio.play()
    showAllMines()
    turn++
    turns.innerText = `Turns: ${turn}`
    score.innerText = `Score: ${count}`
    clearInterval(timerId)
    gameOver = true
    return
  }

  // Cells will turn into a safe Cell
  const number = cell.dataset.number
  cell.classList.add('safe-cell')
  if (number > 0) {
    cell.innerText = number
  } else {
    showEmpty(cell)
  }
  checkWin()
}

// Uses breadth-first search from clicked empty space and spreads
const showEmpty = (cell) => {
  const id = parseInt(cell.dataset.id)
  const que = [id]
  // https://www.w3schools.com/js/js_set_methods.asp
  const visited = new Set()

  for (let i = 0; i < que.length; i++) {
    const current = que[i]
    const currentCell = cells[current]

    if (
      !currentCell ||
      visited.has(current) ||
      currentCell.classList.contains('flag')
    ) {
      continue
    }

    visited.add(current)
    currentCell.classList.add('safe-cell')

    const number = currentCell.dataset.number
    if (number > 0) {
      currentCell.innerText = number
      continue
    }

    const adjacent = getNeighborIndices(current)
    que.push(...adjacent)
  }
}

// Checks the cells that are on the edges of the board and doesn't allow them get out
const getNeighborIndices = (i) => {
  const adjacent = []
  const isLeftEdge = i % width === 0
  const isRightEdge = i % width === width - 1

  // Left cell
  if (i > 0 && !isLeftEdge) {
    adjacent.push(i - 1)
  }

  // Right cell
  if (i < width * width - 1 && !isRightEdge) {
    adjacent.push(i + 1)
  }

  // Top cell
  if (i >= width) {
    adjacent.push(i - width)
  }

  // Bottom cell
  if (i < width * (width - 1)) {
    adjacent.push(i + width)
  }

  // Top-Left cell
  if (i >= width && !isLeftEdge) {
    adjacent.push(i - width - 1)
  }

  // Top-Right cell
  if (i >= width && !isRightEdge) {
    adjacent.push(i - width + 1)
  }

  //Bottom-left cell
  if (i < width * (width - 1) && !isLeftEdge) {
    adjacent.push(i + width - 1)
  }

  // Bottom-Right cell
  if (i < width * (width - 1) && !isRightEdge) {
    adjacent.push(i + width + 1)
  }

  return adjacent
}

// Flags when you right click on a cell
const toggleFlag = (cell) => {
  if (cell.classList.contains('safe-cell')) {
    return
  }
  //https://www.w3schools.com/jquery/eff_toggle.asp#:~:text=The%20toggle()%20method%20toggles,This%20creates%20a%20toggle%20effect.
  cell.classList.toggle('flag')
}

// Shows all the mines when a mine is clicked
const showAllMines = () => {
  cells.forEach((cell) => {
    if (cell.dataset.mine === 'true') {
      cell.classList.add('mine')
    }
  })
}

// This Function Checks if the win condition has been met
const checkWin = () => {
  const safeCells = cells.filter((cell) => !cell.dataset.mine)
  const showSafeCells = safeCells.filter((cell) =>
    cell.classList.contains('safe-cell')
  )

  if (safeCells.length === showSafeCells.length) {
    alert('YOU WIN!')
    const audio = new Audio('./audio/Yippee.mp3')
    audio.play()
    showAllMines()
    gameOver = true
    clearInterval(timerId)
    count++
    turn++
    turns.innerText = `Turns: ${turn}`
    score.innerText = `Score: ${count}`
  }
}

// Timer in seconds
const setTimer = () => {
  timer++
  time.innerText = `Time: ${timer} Seconds has Passed!`
}
// Resets board
reset.addEventListener('click', () => {
  gameOver = false
  timer = 0
  clearInterval(timerId)
  boardCreate()
})

boardCreate()
