export class UserAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UserNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
export class OrderNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
export class NotAllowed extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

