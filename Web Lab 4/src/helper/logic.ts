// import {expireMinutes} from './args'


export function setExpirationDate(days) {
  const expiredAt = new Date()
  expiredAt.setDate(expiredAt.getDate() + days);
  return expiredAt
}