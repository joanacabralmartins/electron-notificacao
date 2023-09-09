const { 
  app,
  BrowserWindow,
  Notification,
  ipcMain,
} = require('electron')

const path = require('path')
const axios = require('axios')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  //carregarNotificacoes()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function carregarNotificacoes() {
  axios.get('http://localhost:3000/mostrarNotificacao')
    .then(response => {
      console.log(response)

      const notificacoes = response.data.notificacao

      novaNotification(notificacoes)
    })
    .catch(error => {
      console.error("Error fetching data:", error)
    })
}

function novaNotification(notificacoes) {
  if(!Notification.isSupported()) {
    console.log("Notificações não são suportadas neste ambiente.");
    return;
  }

  notificacoes.forEach((notificacao) => {
    const { titulo, corpo } = notificacao;

    const novaNotification = new Notification({
      title: titulo,
      subtitle: 'Subtítulo',
      body: corpo,
      silent: true,
      timeoutType: "default",
    });

    console.log("Exibindo notificação");

    novaNotification.show();
  })
}

ipcMain.on('enviar-notificacao', (event, titulo, corpo) => {
  console.log(titulo, corpo)

  axios.patch('http://localhost:3000/atualizarNotificacao', { 
    titulo: titulo,
    corpo: corpo,
    mostrar: 1,
  })
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.error(error)
    })
})