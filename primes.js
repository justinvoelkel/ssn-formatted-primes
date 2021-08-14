const fs = require('fs')

// utility fn to check if a number is a prime number
// Tried this brute force by keeping a running list of primes and checking divisibility
// brute force would have been linear O(n)
// Tried using the 'sieve' method as well but was significantly slower up to 9999
// current time complexity should be O(sqrt(n))
// which I think performs closer to O(log(n)) at larger scale
const isPrime = num => {
  // first prime is 2 and anything divisable by 2 or 3 is not prime
  if(num < 2) return false
  // first two primes
  if(num === 2 || num === 3) return true
  // any even can be elimnated after 2
  if(!(num % 2)) return false
  const sqRoot = Math.floor(Math.sqrt(num))
  // only need to check up to sq root of number because math reasons
  // since we start at 3 we should be able to skip evens by incrementing by 2
  for(i=3; i<=sqRoot; i+=2){
    if(!(num % i)) return false
  }

  return true
}

// pad number with appropriate amount of zeros
const padZeros = (num, width) => {
  const numArr = num.toString().split("")
  let paddedArr = new Array(width - (numArr.length)).fill(0)
  return paddedArr.concat(numArr).join("")
}

// generate the cartesian products of the two, three, and four digit strings
const cartesianProducts = (...segments) =>
      segments.reduce((acc, s) =>
                      acc.flatMap(d =>
                                  s.map(e => [d, e].flat())));

// generate an array of prime numbers up to the defined max
const getPrimes = max => {
  let primes = []
  let count = 0
  while(count <= max) {
    if(isPrime(count)) primes.push(count)
    count++
  }
  return primes
}

// generator fn to iterate over cartesian results
// shortest on the outside - longest on the inside
// might be a more efficient way of doing this?
// Time complexity will be bad with nested iterations
function* GeneratePrimeSsns ([a, b, c]){
  for(x=0; x<a.length; x++){
    for(y=0; y<b.length; y++){
      for(z=0; z<c.length; z++){
        const str = `${b[y]}${a[x]}${c[z]}`
        if(isPrime(Number(str))) yield str
      }
    }
  }
}

// calculate primes to satisfy up to four digits
const maxPrimes = getPrimes(9999)
// convert up to four digit primes to padded strings '0002'
const fourDigits = maxPrimes.map(n => padZeros(n, 4))
// gather subset of up to three digits in padded strings '002'
const uptoThreeDigits = maxPrimes
      .filter(n => n.toString().length <= 3)
      .map(n => padZeros(n, 3))
// gather subset of two digits in padded strings '02'
const uptoTwoDigits = maxPrimes
      .filter(n => n.toString().length <= 2)
      .map(n => padZeros(n, 2))
// get cartesian product of two, three, and four digit strings
const productArr = cartesianProducts([uptoTwoDigits, uptoThreeDigits, fourDigits])
// considering resources use generator function to return full set primes
const iter = GeneratePrimeSsns(productArr)
// loop till we run out of prime combinations
let result = iter.next()
while(!result.done){
  // add the dashes to fulfill the format requirement
  let formatted = result.value.split("")
  formatted.splice(3, 0, '-')
  formatted.splice(6, 0, '-')
  formatted = formatted.join("")
  // output the formatted string (maybe send to a file for checking)
  console.log(formatted)
  result = iter.next()
}
