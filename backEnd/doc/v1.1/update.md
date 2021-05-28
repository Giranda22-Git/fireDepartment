теперь при отправке сообщения newFire нужно та же отправлять свойство
geoData - обьект в котором должно быть предположительно altitue: и latitude:

в итоге должно выглядеть так:
{
  action: 'newFire',
  agent: 'user',
  data: {
    causing: id, // id пользователя который заявил о пожаре и пытается вызвать пожарных
    address: this.newFireAddress, // адресс пожара
    geoData: { // геопозиция пожара
      latitude: 54, // эти данные лишь пример можешь писать какие угодно данные сюда включая ключи свойств
      altitude: 45
    }
  }
}
раньше это тоже было но не работало


а так же теперь когда тебе приходит сообщение с
action === 'startGeoDataTransfering'
тебе будет приходить новое свойство
causingGeoData - геопозиция пожара, или же геопозиция пользователя на момент регистрации пожара

в итоге тебе придет такое сообщение
{
  action: "startGeoDataTransfering",
  agent: "server",
  data: {
    causingGeoData: {
      altitude: 45
      latitude: 54
    },
    causingPhoneNumber: "+7(705)553-99-66"
  }
}

далее появился новый запрос
http://localhost:3000/users/typeOfUser - изменение типа пользователя с user на fireman и наобарот
тело запроса
{
  "id": "60a7761c329dcaea9cbce693", // id пользователя у коттрого нужно изменить typeOfUser
  "typeOfUser": true/false // то на кого нужно поменять где true это fireman а false это user
}