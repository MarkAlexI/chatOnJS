function makeMessage(type, text, id) {
  return {
    type: type,
    text: text,
    id: id,
    date: Date.now(),
  };
}

module.exports = makeMessage;
