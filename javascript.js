const divContainer = document.getElementById("container");
const game = document.getElementById("game");
var initialImageArray = ['pics/cat.jfif', 'pics/cow.jfif', 'pics/duck.jfif', 'pics/frenchie.jfif', 'pics/horse.jfif', 'pics/smth.jfif',
    'pics/smthelse.jfif','pics/zebra.jfif'];
var images = [];
var submitButton = document.getElementById("SubmitButton");
var m;
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;
let name;

function timer(){
    time = setInterval(function(){
        seconds++;
        if(seconds === 60){
            minutes++;
            seconds = 0;
        }
        seconds = seconds < 10 ? '0'+ seconds : seconds;
        if(minutes<10){
             timeCounter.innerHTML = "Timer: " +'0' + minutes + ":" + seconds;
        } else {
            timeCounter.innerHTML = "Timer: " + minutes + ":" + seconds;
        }
    }, 1000);
}
function stopTime(){
    clearInterval(time);
}
function resetEverything(){
    stopTime();
    timeStart = false;
    seconds = 0;
    minutes = 0;
    timeCounter.innerHTML = "Timer: 00:00";
}


function initializeState(array){
    function flush(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    var flushedImages = flush(array);
    var state = [];
    for (let i = 0; i < Math.sqrt(flushedImages.length); i++){
        state[i]=[];
        for (let j = 0; j < Math.sqrt(flushedImages.length); j++){
            state[i][j]=null;
        }
    }
    for (let i = 0; i < flushedImages.length; i++){
        URL = flushedImages[i];
        var cell = {
            pictureURL: URL,
            status: 1,
            name: URL,
        };
        state[Math.floor(i / Math.sqrt(flushedImages.length))][Math.floor(i % Math.sqrt(flushedImages.length))] = cell;
    }
    return state;
}

var state = initializeState(images);

function destroyDivs() {
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
}
var clickedCard = null;
var numberOfMatched = 0;

function renderState(matrix) {
    for (let i = 0; i < state.length; i++) {
        var row = document.createElement('div');
        for (let j = 0; j < state[0].length; j++) {
            var htmlElement = document.createElement('div');
            row.appendChild(htmlElement);
            divContainer.appendChild(row);
            document.body.appendChild(divContainer);
            htmlElement.classList.add('card');
            function addEvent(){
                if (clickedCard === null) {
                    state[i][j].status = 2;
                    tempI = i;
                    tempJ = j;
                    clickedCard = clickedCard+1;
                    destroyDivs();
                    renderState(state);
                } else if (clickedCard !== null) {
                    if (state[tempI][tempJ].name === state[i][j].name) {
                        state[i][j].status = 2;
                        state[tempI][tempJ].status = 2;
                        destroyDivs();
                        renderState(state);
                        state[tempI][tempJ].status = 3;
                        state[i][j].status = 3;
                        setTimeout(()=> {
                            destroyDivs();
                            renderState(state);
                        }, 800);
                        numberOfMatched= numberOfMatched + 2;
                        clickedCard = null;
                        tempI = null;
                        tempJ = null;
                        setTimeout(()=> {
                            if(numberOfMatched === state.length*state[0].length){
                                alert('Congratulations, ' + name + ' ! You won!');
                                destroyDivs();
                                state = initializeState(images);
                                numberOfMatched = 0;
                                resetEverything();
                            }
                        },900);
                    } else {
                        state[i][j].status = 2;
                        state[tempI][tempJ].status = 2;
                        destroyDivs();
                        renderState(state);
                        state[i][j].status = 1;
                        state[tempI][tempJ].status = 1;
                        setTimeout(()=> {
                            destroyDivs();
                            renderState(state);
                        }, 800);
                        clickedCard = null;
                        tempI = null;
                        tempJ = null;
                    }
                }
            }
            htmlElement.addEventListener('click', addEvent)
            if (state[i][j].status === 1) {
                htmlElement.classList.add('hidden');
            } else if (state[i][j].status === 3) {
                htmlElement.classList.add('deleted');
                htmlElement.removeEventListener('click', addEvent);
            } else if (state[i][j].status === 2) {
                htmlElement.classList.add('visible');
                var currentURL = state[i][j].pictureURL;
                htmlElement.style.backgroundImage = "url(" + currentURL + ")";
                htmlElement.removeEventListener('click', addEvent);
            }
        }
       game.appendChild(row);
    }
}

submitButton.addEventListener('click', function(){
    var select = document.getElementById('size');
    m = select.options[select.selectedIndex].value;
    name = document.getElementById('name').value;
    if(m == 2){
        for (var i = 0; i < m*m/2; i++){
            var randomNr = Math.floor(Math.random()*(7-0)+0);
            images.push(initialImageArray[randomNr]);
            images.push(initialImageArray[randomNr]);
        }
    }else{
        for (var i = 0; i < m*m/2; i++) {
            images.push(initialImageArray[i]);
            images.push(initialImageArray[i]);
        }
    }
    resetEverything();
    timer();
    clickedCard = null;
    destroyDivs();
    state = initializeState(images);
    renderState(state);
    numberOfMatched = 0;
    images.length =0;
})
