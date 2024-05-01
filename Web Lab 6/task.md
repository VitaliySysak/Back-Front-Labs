Розробити серверну частину проекту "NY Times". Сервер повинен дозволяти виконувати наступні дії:
* створити користувача
* залогінити користувача
* створити книгу
  POST /books
  body: {
   title: string,
   pageLinks: { pageLink: string }[]
  }
* отримати список книг відносно користувача
* отримати рандомну частину
  GET /parts
  size
  response: {
   imageUrl: string,
   otp: string
   box: { 
    x: number,
    y: number,
    width:number,
    height: number
   }
  }
co
  otp -- це унікальний токен, значення якого зберігається у колекції partAccessTokens
* надіслати варіант тексту
  POST /parts/:_id
  body: { text: string, otp: string }

  ** перевірити чи otp належить part._id
  ** після перевірки незалежно від результату необхідно видалити otp