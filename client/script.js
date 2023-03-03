import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader (element) {
    element.textContent = '';

    loadInterval = setInterval( () => {
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }
    }, 300); //time to respond 300ms
}

function typeText(element, text){
    let index = 0;

    let interval = setInterval(()=>{
        if (index < text.lenght) {
            element.innerHTML += text.chartAt(index);
            index ++;  //type charecter 1 by one like it is type by a human.
        } else {
            clearInterval(interval);
        }
    }, 20); //time to respont 20ms
}