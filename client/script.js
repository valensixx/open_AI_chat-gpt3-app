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
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index ++;  //type charecter 1 by one like it is type by a human.
        } else {
            clearInterval(interval);
        }
    }, 20); //time to respond 20ms
}

function genetateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src="${isAi ? bot : user}"
                        alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id="${uniqueId}">
                    ${value}
                </div>
            </div>
        </div>
        `
    )
}


const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //chat bot's chatstripe
    const uniqueId = genetateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId); //we are filling it up from loader function!

    chatContainer.scrollTop = chatContainer.scrollHeight; //this will put the new messages in a view

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv); 

    //here we will fetch the data from the server -> bot's response
    const response = await fetch('http://localhost:5000',{
        method: 'POST',
        headers: {
            'Content-type': 'aplication/json' 
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok) {
        const data = await response.json();
        const parseData = data.bot.trim();

        typeText(messageDiv, parseData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";
    }
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13){
        handleSubmit(e);
    }
});