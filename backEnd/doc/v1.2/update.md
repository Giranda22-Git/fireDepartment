новые запросы:

GET http://localhost:3000/currentFire - получение массива всех текущих пожаров

GET http://localhost:3000/currentFire/:status - получение массива текущих пожаров отфильтрованных по статусу а то есть begin/inProcess/ended



новый action == 'fireFightingIsOver' // action для обозначения окончания операции вне зависимости от результата
data: {
  fireManPhoneNumber: String, // номер телефона пожарного выполняющего вызов
  report: String, // письменный отчет от пожарного
  victims: Array, // массив обьектов, содержит всех пострадавших во время пожара, структура на строке 26
  combustionPercentage: String, // процент сгоревшего example value == '50%'
}
в итоге отправляет сообщение пожарному завершившему операцию имеет такие данные:
{
  action: 'fireFightingIsOver',
  agent: 'server',
  data: {
    extinguishedFire // данные потушеного пожара которые будут добавлены в архив всех потушеных пожаров
  }
}


структура
victims:
[
  {
    firstName: String, // необезательный
    lastName: String, // необезательный
    iin: String, // необезательный
    state: String  // alive or dead, обязательный
  }
]