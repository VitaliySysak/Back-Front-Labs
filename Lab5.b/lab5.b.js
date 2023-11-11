//1
function semiPer(a,b,c) {
  let p
  p = (a+b+c)/2
  return p

}  

function calculateTriangleArea(a, b, c) {
  let p = semiPer(a, b, c);
  let S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
  return S;
}
console.log(calculateTriangleArea(10, 15, 20));

// 2
function sin(s) {
  let g = Math.sin(s * (Math.PI / 180));
  return g;
}

function calculateTwoSidesAndAngle(a, b, s) {
   let g = sin(s);
   let S = 0.5 * a * b * g;
   return S;
}
console.log(calculateTwoSidesAndAngle(10, 15, 45)); 

//3
function calculate(a, h) {
  S = 0.5 * a * h
  return S
}
console.log(calculate(10, 15));

function calculateBySircle(a, b, c, R) {
  let S = (a * b * c) / (4 * R)
  return S
}
console.log(calculateBySircle(10, 5, 10, 50))

//4
function isBigger(firstnumber) {
  return firstnumber > secondnumber
}
const firstnumber = 500;
const secondnumber = 700;
if (isBigger(firstnumber)) {
  console.log(firstnumber + ' є більше')
  } else {
      console.log(firstnumber + ' є меньше')
  }

//5
function isPalindrome(str) {
  const reversedStr = str.split('').reverse().join('');
  return str === reversedStr;
}

const number = 101; 
const strNumber = number.toString(); 
if (isPalindrome(strNumber)) {
  console.log('Число є паліндромом');
} else {
  console.log('Число не є паліндромом');
}

//6
function isAnagram(word1, word2) {
  const sortedWord1 = word1.split('').sort().join('');
  const sortedWord2 = word2.split('').sort().join('');
  return sortedWord1 === sortedWord2;
}
  if (isAnagram('shark', 'tiger')) {
      console.log("Анаграма")
  } else {
      console.log("неАнаграма")
  }

//7
function fibonacciNumberByIndex(index) {

  let sequence = [1, 1];

  for (let i = 2; i < index; i = i + 1) {
      let nextNumber = sequence[i - 1] + sequence[i - 2];
      sequence.push(nextNumber);
  }

  return sequence[index - 1];
}
let n = 100;
let result = fibonacciNumberByIndex(n);
console.log(`Число Фібоначчі за індексом ${n}: ${result}`);

//8
function isFibonacciNumber(num) {
  let sequence = [1, 1];
  let i = 2;

  while (sequence[i - 1] <= num) {
      let nextNumber = sequence[i - 1] + sequence[i - 2];
      sequence.push(nextNumber);
      i = i + 1;
  }

  return sequence.includes(num);
}

let numberToCheck = 5;

if (isFibonacciNumber(numberToCheck)) {
  console.log(`${numberToCheck} є числом Фібоначчі`);
} else {
  console.log(`${numberToCheck} не є числом Фібоначчі`);
}