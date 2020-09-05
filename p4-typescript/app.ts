// TS infers that num1 is HTMLElement
const num1El = document.getElementById('num1') as HTMLInputElement;
const num2El = document.getElementById('num2') as HTMLInputElement;
const resultEl = document.getElementById('result') as HTMLParagraphElement;

// TS infers that the button is of type HTMLButtonElement (because uses the selector)
const button = document.querySelector('button');

function add(num1: number, num2: number) {
  return num1 + num2;
}

button.addEventListener('click', () => {
  const num1 = parseInt(num1El.value);
  const num2 = parseInt(num2El.value);

  const result = add(num1, num2);
  resultEl.innerText = `The result is ${result}`;
});
