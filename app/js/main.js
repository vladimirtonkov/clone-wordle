
const wrapperModal = document.querySelector('.wrapper')
const infoTextModal = document.querySelector('.statistics__title')
const BtnCloseModal = document.querySelector('.statistics__close')
const nextWordle = document.querySelector('.statistics__next-time-wordle')

// Слово которое нужно отгадать
const guessWord = 'привет'

let indexRow = 0;
let indexColumn = 0
let word = ''
let arrayWords = []
let correctLetters = 0
let JSONdata = [];
let checkingRightWord = false



let grid = document.querySelector('.grid');
let arrGrid = []
function AddGridCell() {
  for (let column = 0; column < 5; column++) {
    let columnCell = document.createElement('tr')
    let arr = []
    columnCell.className = 'columnCell'
    for (let row = 0; row < guessWord.length; row++) {
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

    if (checkingRightWord) {
      document.removeEventListener('keydown', СheckingWordForMatch)
    }
  }
}

AddGridCell()
loadFile()


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




function loadFile() {
  fetch('../words/word.txt')
    .then(function (response) {
      return response.text()
    })
    .then(function (data) {
      dataTxt(data.split('\r\n'))
    })

}


document.addEventListener('keydown', СheckWordForMatch);




function dataTxt(data) {
  arrayWords = data.filter(element => element.length === guessWord.length)
}


function animationCell(indexCell, color) {

  // setTimeout(() => {
  arrGrid[indexColumn][indexCell].classList.add('degree-animation')
  arrGrid[indexColumn][indexCell].classList.add(color)
  // }, (2 + indexCell * 2) + '00')

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
  document.removeEventListener('keydown', СheckWordForMatch)
})




setInterval(() => {
  settingTimeForNewGame()
}, 1000)

function settingTimeForNewGame() {
  let date = new Date()

  let hours = date.getHours()
  let minute = date.getMinutes();
  let seconds = date.getSeconds()

  nextWordle.innerHTML = (23 - hours) + ' : ' + (59 - minute) + ' : ' + (59 - seconds)
  localStorage.setItem('currentTime', JSON.stringify((23 - hours) + ' : ' + (59 - minute) + ' : ' + (59 - seconds)))

  let time = JSON.parse(localStorage.getItem('currentTime'))
  let currentTime = time.split(':')

  if (+currentTime[0] === 0 && +currentTime[1] === 0 && +currentTime[2] === 0) {
    let index = Math.floor(Math.random() * arrayWords.length)
    guessWord = arrayWords[index]
    console.log('show guessWord ', guessWord)
  }
}

// console.log('JSONdata', JSONdata)
