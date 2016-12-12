# start-project
Структура:
```
app/
|--scss/
   |--global/
   |--blocks/
   |--vendors/
   |--variables.scss
   |--functions.scss
   |--mixins.scss
   |--styles.scss
|--img/
|--js/
   |--plugins/
|--fonts/
|--blocks (инклюды)
  
build/
other/
```

## Установка
1. Перейти в родительскую папку проектов
2. Запустить консоль Git Bash
3. Ввести команду `git clone https://github.com/corvus-007/start-project имя_проекта`, где `имя_проекта` — название вашего проекта
4. Перейти в каталог проекта `cd имя_проекта`
5. Установить модули из package.json — `npm install`

## Запуск проекта
`npm start`
## Сборка проекта
`npm build`
## Удаление папки build
`gulp clean`
