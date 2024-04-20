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

export class EmailRequired extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class LinkNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class ExpiredLink extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class NoExpiration extends Error {
  constructor(msg: string) {
    super(msg);
  }
}




