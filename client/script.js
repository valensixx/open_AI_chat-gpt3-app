const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chat stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    // chat bot's chat stripe
    const uniqueId = genetateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // send user's message to server
    const response = await fetch('http://localhost:5173', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parseData = data.bot.trim();

        // display response from server on chat interface
        const botUniqueId = genetateUniqueId();
        chatContainer.innerHTML += chatStripe(true, parseData, botUniqueId);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        const botMessageDiv = document.getElementById(botUniqueId);
        typeText(botMessageDiv, parseData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";

        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});