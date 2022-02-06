document.addEventListener('DOMContentLoaded', async () => {

  const InfoGameShowBtn = document.querySelector('.header__info')
  const wrapperModal = document.querySelector('.wrapper')
  const infoTextModal = document.querySelector('.statistics__title')
  const BtnCloseModal = document.querySelector('.statistics__close')
  const BtnNewGame = document.querySelector('.statistics__button')
  const InfoGameHideBtn = document.querySelector('.info-game__close')

  // Слово которое нужно отгадать
  let guessWord = ''
  const lengthWord = 6;
  let indexRow = 0;
  let indexColumn = 0;
  let word = '';
  let arrayWords = [];
  let correctLetters = 0;
  let randomIndex = 0


  let grid = document.querySelector('.grid');
  let arrGrid = []
  function AddGridCell() {
    for (let column = 0; column < 5; column++) {
      let columnCell = document.createElement('tr')
      let arr = []
      columnCell.className = 'columnCell'
      for (let row = 0; row < 6; row++) {
        let rowCell = document.createElement('td');
        rowCell.className = 'rowCell'
        let titleSpan = document.createElement('span')
        titleSpan.className = 'title';
        rowCell.append(titleSpan)
        columnCell.append(rowCell)
        arr.push(rowCell)
      }
      grid.append(columnCell)
      arrGrid.push(arr)

    }
  }

  AddGridCell()

  // function loadFile() {
  //   fetch('../words/word.txt')
  //     .then(function (response) {
  //       return response.text()
  //     })
  //     .then(function (data) {
  //       dataTxt(data.split('\r\n'))
  //     })

  // }

  let response = await fetch('../words/word.txt')

  if (!response.ok) {
    return new Error(`Ошибка ${response}`)
  }

  let text = await response.text();
  data = text.split('\r\n')

  arrayWords = data.filter(element => element.length === lengthWord)

  randomIndex = Math.floor(Math.random() * arrayWords.length)
  console.log(randomIndex)

  guessWord = arrayWords[randomIndex]
  console.log('guessWord ', guessWord)


  function СheckWordForMatch(event) {
    console.log(event.key)
    let keyboardEvent = event.key.toLowerCase()
    if (indexColumn < arrGrid.length) {
      if (keyboardEvent >= 'а' && keyboardEvent <= 'я' && keyboardEvent !== 'enter') {
        if (indexRow < arrGrid[indexColumn].length) {
          arrGrid[indexColumn][indexRow].children[0].innerHTML = keyboardEvent.toUpperCase();
          word += keyboardEvent.toUpperCase();
          indexRow++
        }
      } else if (keyboardEvent === 'enter' && indexRow !== arrGrid[indexColumn].length) {

        infoModalAnimation('Недостаточно букв')


      } else if (keyboardEvent === 'enter' && indexRow === arrGrid[indexColumn].length) {

        if (arrayWords.includes(word.toLowerCase())) {
          for (let k = 0; k < guessWord.length; k++) {
            if (guessWord[k] === word[k].toLowerCase()) {

              correctLetters++
              animationCell(k, 'green-color')

            } else if (guessWord[k] !== word[k].toLowerCase() && guessWord.includes(word[k].toLowerCase())) {
              animationCell(k, 'yellow-color')
            } else {
              animationCell(k, 'gray-color')
            }

            if (indexColumn === arrGrid.length - 1 && k === guessWord.length - 1) {
              infoModalAnimation('Приходите завтра ', 'block', 'Ничего страшного, в следующий раз повезет) ')
            }
          }

          if (correctLetters === guessWord.length) {

            infoModalAnimation('Великолепно', 'block', 'Поздравляю!!!')
          }
          if (indexColumn < arrGrid.length - 1) {
            indexColumn++;
          }

          indexRow = 0;
          word = '';
          correctLetters = 0;

        } else {
          infoModalAnimation('В словаре игры нет такого слова, попробуйте другое!')
        }


      } else if (keyboardEvent === 'backspace' && indexRow > 0) {
        arrGrid[indexColumn][indexRow - 1].children[0].innerHTML = ''
        indexRow--
        word = word.slice(0, -1)
        console.log(word)
      }
    }
  }



  document.addEventListener('keydown', СheckWordForMatch);




  function animationCell(indexCell, color) {

    arrGrid[indexColumn][indexCell].classList.add('degree-animation')
    arrGrid[indexColumn][indexCell].classList.add(color)

  }

  function infoModalAnimation(titleStr, display = 'none', infoText = '') {

    document.querySelector('.modal-info').style.display = 'block';
    document.querySelector('.modal-info').children[0].innerHTML = titleStr;
    document.querySelectorAll('.columnCell')[indexColumn].classList.add('animation-pulse')

    let timeId = setTimeout(() => {

      document.querySelector('.modal-info').style.display = 'none';
      document.querySelectorAll('.columnCell')[indexColumn].classList.remove('animation-pulse')

      infoTextModal.innerHTML = infoText
      wrapperModal.style.display = display
      clearTimeout(timeId)
    }, 2000)

  }


  BtnCloseModal.addEventListener('click', () => {
    wrapperModal.style.display = 'none'
  })

  BtnNewGame.addEventListener('click', () => {
    wrapperModal.style.display = 'none'
    randomIndex = Math.floor(Math.random() * arrayWords.length)
    guessWord = arrayWords[randomIndex]
    indexColumn = 0
    indexRow = 0
    word = ''
    for (let j = 0; j < arrGrid.length; j++) {
      for (let h = 0; h < arrGrid[j].length; h++) {
        arrGrid[j][h].children[0].innerHTML = '';
        arrGrid[j][h].classList.remove('degree-animation')
        arrGrid[j][h].classList.remove('green-color')
        arrGrid[j][h].classList.remove('yellow-color')
        arrGrid[j][h].classList.remove('gray-color')

      }
    }

  })

  InfoGameShowBtn.addEventListener('click', () => {
    document.querySelector('.info-game').style.display = 'block'
  })

  InfoGameHideBtn.addEventListener('click', () => {
    document.querySelector('.info-game').style.display = 'none'
  })
})









