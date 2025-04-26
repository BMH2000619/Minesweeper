const main = document.querySelector('main')
const reset = document.querySelector('button')
let cells = []
const mineCount = 10
const width = 10

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
}

const calcNumbers = () => {
  for (let i = 0; i < cells.length; i++) {
    const isLeftEdge = i % width === 0
    const isRightEdge = i % width === width - 1

    let total = 0

    if (cells[i].dataset.mine === 'true') continue

    const adjacent = []
    if (!isLeftEdge && i > 0) adjacent.push(i - 1)
    if (!isRightEdge && i < 99) adjacent.push(i + 1)
    adjacent.push(i - width)
    adjacent.push(i + width)
    if (!isLeftEdge && i - width > 0) adjacent.push(i - width - 1)
    if (!isRightEdge && i - width >= 0) adjacent.push(i - width + 1)
    if (!isLeftEdge && i + width < 100) adjacent.push(i + width - 1)
    if (!isRightEdge && i + width < 100) adjacent.push(i + width - 1)

    const validAdjacent = adjacent.filter(
      (n) => cells[n].dataset.mine === 'true'
    )

    cells[i].dataset.number = validAdjacent.length
  }
}

let handleClick = (cell) => {
  if (cell.classList.contains('flag')) {
    return
  }

  if (cell.dataset.mine === 'true') {
    cell.classList.add('mine')
    alert('Game Over!')
    revealAllMines()
    return
  }
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

reset.addEventListener('click', boardCreate())

boardCreate()
