const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  // Menampilkan indikator loading (John sedang berpikir)
  const botMsgElement = appendMessage('bot', 'RAI sedang mengetik... ⏳');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });

    const data = await response.json();
    // Update pesan bot dengan hasil dari API dan tambahkan emoji di akhir
    const finalResponse = (data.result || 'Maaf, RAI tidak mengerti.') + ' ✨';
    botMsgElement.textContent = finalResponse;
    conversation.push({ role: 'model', text: data.result });
  } catch (error) {
    botMsgElement.textContent = 'Aduh, sepertinya ada masalah koneksi. Coba lagi ya! 😅';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
