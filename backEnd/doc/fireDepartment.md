пожарные депо:

GET http://localhost:3000/fireDepartment - получение массива всех пожарных депо

POST http://localhost:3000/fireDepartment - создание нового пожарного депо
тело запроса:
{
  "numberOfFireDepartment": "12",
  "city": "Almaty",
  "region": "Жетысуский",
  "address": "микрорайон Дорожник, 27а"
}

POST http://localhost:3000/fireDepartment/binding - добавление пожарных бригад к пожарному депо
ВНИМАНИЕ !!! иногда этот запрос работает криво пока используй я его к завтрашнему дню подправлю
{
  "departmentId": "60986a78f367175e92fbee02", // id пожарного депо к которому нужно добавить бригады пожарных
  "brigades": [ // массив id пожарных бригад которые нужно добавить в выше указаное пожарное депо
    "60987cb9bc2a9a6445d241fd"
  ]
}

POST http://localhost:3000/fireDepartment - поиск пожарного депо по id
{
  "departmentId": "60986a78f367175e92fbee02" // id пожарного депо которое ты ищешь
}