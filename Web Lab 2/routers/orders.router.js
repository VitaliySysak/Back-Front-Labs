import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares.js'
import { ORDERS, USERS } from '../db.js';
import { ADDRESSES } from '../db.js';

export const OrdersRouter = Router();

 const standard = 2.5
 const lite = 1.5
 const universal = 3
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
  const R = 6371;
  const lat1 = toRadians(latitude1);
  const lon1 = toRadians(longitude1);
  const lat2 = toRadians(latitude2);
  const lon2 = toRadians(longitude2);
  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; 
}


const convertToDate = (date) => {

 /***
  * ^ -- початок рядка
  * \d -- перевірка на цифру
  * {N} -- N - разів повторень
  */
 // if (/^\d\d-(01|02|03|....|10|11|12)-\d{4}$/.test(query.createdAt)) { }
 if (!/^\d\d-\d\d-\d{4}$/.test(date)) {
  // return res.status(400).send({ message: `parameter createdAt has wrong format` });
  throw new Error(`parameter createdAt has wrong format`);
 }

 // const res = query.createdAt.split('-');
 // const month = res[1];
 const [day, month, year] = date.split('-');

 const mothsInt = parseInt(month);
 if (mothsInt < 1 || mothsInt > 12) {
  // return res.status(400).send({ message: `parameter createdAt has wrong month value` });

  throw new Error(`parameter createdAt has wrong month value`);
 }

 const result = new Date();
 result.setHours(2);
 result.setMinutes(0);
 result.setMilliseconds(0);
 result.setSeconds(0);

 result.setMonth(mothsInt - 1);
 result.setDate(day);
 result.setFullYear(year);

 return result;
};

const convertToDateMiddleware = (fieldName) => (req, res, next) => {
 const valueString = req.query[fieldName];

 if (!valueString) {
  return next();
 }
 try {
  const value = convertToDate(valueString);
  req.query[fieldName] = value;
  return next();
 } catch (err) {
  return res.status(400)
   .send({ message: err.toString() });
 }
};

OrdersRouter.post('/orders', authorizationMiddleware, (req, res) => {
 const { body, user } = req;

 const createdAt = new Date();
 createdAt.setHours(2);
 createdAt.setMinutes(0);
 createdAt.setMilliseconds(0);
 createdAt.setSeconds(0);

 const startAddress = ADDRESSES.find(el => el.name === body.from)
 const endAddress = ADDRESSES.find(el => el.name === body.to)
 if (!startAddress || !endAddress) {
  return res.status(400).send({ message: 'There is no from or to parametres' })
}
 const distance = calculateDistance(startAddress.location.latitude, startAddress.location.longitude, endAddress.location.latitude, endAddress.location.longitude).toFixed(2);
 
 let price = 0

 if (body.type === 'standart'){
  price = distance * standard
 }
 else if (body.type === 'lite'){
  price = distance * lite
 }
 else if (body.type === 'universal'){
  price = distance * universal
 }
 else {
  return res.status(400)
     .send({ message: 'нема поля type'});
 }

 const order = {
  ...body,
  login: user.login,
  createdAt,
  status: "Active",
  id: crypto.randomUUID(),
  distance: `${distance} km`,
  price: `$${price.toFixed(2)}`
 };

 ORDERS.push(order);

 return res.status(200).send({ message: 'Order was created', order });
});

/**
* GET /orders?createdAt=05-05-2024
* GET /orders?createdAt= g mhdfbg kjdfbgkjd
*/
OrdersRouter.get('/orders', authorizationMiddleware,
 convertToDateMiddleware('createdAt'),
 convertToDateMiddleware('createdFrom'),
 convertToDateMiddleware('createdTo'),
 (req, res) => {
  const { user, query } = req;

  if (query.createdAt && query.createdFrom && query.createdTo) {
   return res.status(400).send({ message: "Too many parameter in query string" });
  }
  console.log(`query`, JSON.stringify(query));
  let orders = ORDERS.filter(el => el.login === user.login);

  const active = ORDERS.filter(el => el.status === 'Active')
  const all = ORDERS.data;

  if (user.type === 'Driver'){
    return res.status(200).send(active);
  }
  else if (user.type === 'Admin'){
    return res.status(200).send(all);
  }

  if (query.createdAt) {

   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() === query.createdAt.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdFrom) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() >= query.createdFrom.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  if (query.createdTo) {
   try {
    orders = ORDERS.filter(el => {
     const value = new Date(el.createdAt);
     return value.getTime() <= query.createdTo.getTime();
    });
   } catch (err) {
    return res.status(400)
     .send({ message: err.toString() });
   }
  }

  return res.status(200).send(orders);
 });



/**
 * PATCH /orders/fhsdjkhfkdsj
 * PATCH /orders/fhsdjkhfkdsj12
 * PATCH /orders/fhsdjkhfkdsj123
 * PATCH /orders/fhsdjkhfkd123sj
 */

OrdersRouter.patch('/orders/:orderId', authorizationMiddleware, (req, res) => {

 const { params, user } = req;
 console.log(user)

 let order = ORDERS.find(el => el.id === params.orderId);
 console.log(order)

 if (!order) {
  return res.status(400).send({ message: `Order with id ${params.orderId} was not found` });
 }

 const { body } = req;

 let access = {
  "Customer": {
    "Active": "Rejected"
  },
  "Driver": {
    "Active": "In progress",
    "In progress": "Done"
  },
  "Admin": {
    "Active": "Rejected",
    "Active": "In progress",
    "In progress": "Done"
  }
 }
 if (order.status == "Done") { 
  return res.status(400).send({ message: 'can\'t change done'});
}
 else if (access[user.type][order.status] != body.status) {
  return res.status(400).send({ message: `status already ${order.status} or don\'t have permission`});
 }
 


 ORDERS.update((el) => el.id === params.orderId, { status: body.status });

 order = ORDERS.find(el => el.id === params.orderId);
 return res.status(200).send(order);
});