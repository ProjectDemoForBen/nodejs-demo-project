// TS infers that num1 is HTMLElement
const num1El = document.getElementById('num1') as HTMLInputElement;
const num2El = document.getElementById('num2') as HTMLInputElement;
const resultEl = document.getElementById('result') as HTMLParagraphElement;

// TS infers that the button is of type HTMLButtonElement (because uses the selector)
// adding ! because we know that button will not be null
const button = document.querySelector('button')!;

const numberResults : Array<number> = [];
const stringResults : string[] = [];

type NumOrString = number | string;
type Result = {val: number; timestamp: Date};

interface ResultObj {
  val: number;
  timestamp: Date;
}

function add(num1: NumOrString, num2: NumOrString) {
  if(typeof num1 === 'number' && typeof num2 === 'number')
    return num1 + num2;
  else if(typeof num1 === 'string' && typeof num2 === 'string')
    return `${num1} ${num2}`;
  else
    return +num1 + +num2;
}

function printResult(obj : ResultObj) {
  console.log(obj.val)
}

button.addEventListener('click', () => {
  const num1 = num1El.value;
  const num2 = num2El.value;

  const numberResult = add(+num1, +num2);
  numberResults.push(numberResult as number);

  const stringResult = add(num1, num2);
  stringResults.push(stringResult as string);

  console.log(numberResults, stringResults);

  resultEl.innerText = `The result is ${numberResult}`;
  printResult({val: +num1, timestamp: new Date()})
});

const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('resolved');
  }, 1000);
});

promise.then(value => {
  console.log(value.split('l'));
});
console.log('zzz');
