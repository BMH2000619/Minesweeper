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
    cell.addEventListener('contextmenu', () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
      preventDefault()
    })

    main.appendChild(cell)
    cells.push(cell)
  })
}
