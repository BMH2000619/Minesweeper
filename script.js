const main = document.querySelector('main')

for (let i = 0; i < 100; i++) {
  const div = document.createElement('div')
  div.classList.add('size-of-cells')
  if (i === 2) {
    div.classList.add('mine')
  }
  div.id = i + 1
  main.append(div)
}

main.children[0].innerText = '2'
