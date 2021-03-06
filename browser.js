// Посылка запросов -- обычными XHR POST
function PublishForm(form, url) {

  function sendMessage(message) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send(message);
  }

  form.onsubmit = function() {
    var message = form.message.value;
    if (message) {
      form.message.value = '';
      sendMessage(message);
    }
    return false;
  };
}

// Получение сообщений, COMET
function SubscribePane(elem, url) {

  function showMessage(message) {
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    elem.appendChild(messageElem);
  }

  function subscribe() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;

      if (this.status == 200) {
        if (this.responseText) {
          // сервер может закрыть соединение без ответа при перезагрузке
          showMessage(this.responseText);
        }
        subscribe();
        return;
      }

      if (this.status != 502) {
        // 502 - прокси ждал слишком долго, надо пересоединиться, это не ошибка
        showMessage(this.statusText); // показать ошибку
      }

      setTimeout(subscribe, 1000); // попробовать ещё раз через 1 сек
    }
    xhr.open("GET", url, true);
    xhr.send();
  }

  subscribe();

}