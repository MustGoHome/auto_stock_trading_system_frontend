const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const day = now.getDay();

console.log(now);
console.log(hour);
console.log(minute);
console.log(day);


const temp1 = now.getHours().toString().padStart(2, '0')
// console.log(temp1)

const temp2 = now.getMinutes().toString().padStart(2, '0')
console.log(typeof(parseInt(temp1 + temp2)))
