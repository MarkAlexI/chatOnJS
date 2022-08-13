/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chat.js":
/*!*********************!*\
  !*** ./src/chat.js ***!
  \*********************/
/***/ (() => {

eval("\n\nlet url = 'ws://localhost:8080/ws';\nlet ws = new WebSocket(url);\nlet id = '';\n\nif (ws.readyState === 0) {\n  console.log('connecting');\n}\n\nfunction autorize() {\n  let login = document.getElementById('login').value;\n\n let password = document.getElementById('password').value;\n\n  if (!login.length || /\\W/.test(login)) {\n    loginReject('Wrong symbols. Try again.');\n    return;\n  }\n\n if (!password.length || /\\W/.test(password)) {\n   loginReject('Uncorrect password.');\n   return;\n }\n\n  ws.send(JSON.stringify({\n    type: \"login\",\n    id: login,\n    text: password,\n    date: Date.now(),\n  }));\n}\n\nfunction setId(login) {\n  id = login;\n  document.getElementsByClassName('autorize')[0].style.display = 'none';\n  document.getElementsByClassName('typing')[0].style.display = 'block';\n  document.getElementById('chat').style.display = 'block';\n}\n\nws.onclose = event => {\n  console.log(`Closed ${event.code}`);\n  document.getElementsByClassName('wrapper')[0].style.display = 'none';\n  document.body.textContent = 'Server died...';\n};\n\nfunction loginReject(text) {\n  document.getElementById('login').value = '';\n  document.getElementById('login').placeholder = text;\n  return;\n}\n\ndocument.forms.sendmessage.onsubmit = function() {\n    let messageOut = {\n      type: \"message\",\n      text: this.message.value,\n      id: id,\n      date: Date.now(),\n    };\n    ws.send(JSON.stringify(messageOut));\n    return false;\n  };\n\nws.onmessage = function(event) {\n  let messageIn = event.data;\n  let reader = new FileReader();\n  \n  reader.onload = function() {\n    let message = JSON.parse(reader.result);\n    \n    if (message.type === \"login\") {\n      setId(message.text.split`:`[0]);\n      displayMessage(message);\n    }\n    if (message.type === \"reject\") {\n      loginReject(message.text);\n    }\n    if (message.type === \"message\") {\n      displayMessage(message);\n    }\n  }\n  \n  reader.readAsText(messageIn);\n};\n\nfunction displayMessage(message) {\n  \n  let messageDiv = document.createElement('div');\n  messageDiv.classList.add('incoming');\n  messageDiv.textContent =\n    message.type === \"message\"\n    ? message.text\n    : `User ${message.text} join to chat.`;\n  document.getElementById('chat').prepend(messageDiv);\n  \n  let userId = document.createElement('div');\n  userId.classList.add('user');\n  userId.textContent = message.id;\n  document.getElementsByClassName('incoming')[0].prepend(userId);\n  \n  let timePoint = document.createElement('span');\n  timePoint.classList.add('time');\n  timePoint.textContent = ' at ' + new Date(message.date).toTimeString().slice(0, 8);\n  document.getElementsByClassName('user')[0].append(timePoint);\n}\n\n\n//# sourceURL=webpack://chatonjs/./src/chat.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/chat.js"]();
/******/ 	
/******/ })()
;