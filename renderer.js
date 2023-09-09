const btn = document.getElementById('btn')
const tituloInput = document.getElementById('titulo')
const corpoInput = document.getElementById('corpo')

btn.addEventListener('click', () => {
  const titulo = tituloInput.value
  const corpo = corpoInput.value
  window.electronAPI.enviarNotificacao(titulo, corpo)
})