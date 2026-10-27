const currentEl = document.getElementById('current');
const prevEl = document.getElementById('prev');

let current = '0';
let previous = '';
let operator = null;
let justEvaluated = false;

const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function updateDisplay() {
  currentEl.textContent = current;
  prevEl.textContent = operator ? `${previous} ${symbols[operator]}` : '';
}

function appendNumber(n) {
  if (justEvaluated) {
    current = '0';
    justEvaluated = false;
  }
  if (n === '.' && current.includes('.')) return;
  if (current.length >= 15) return;

  if (current === '0' && n !== '.') {
    current = n;
  } else {
    current += n;
  }
}

function chooseOperator(op) {
  if (operator && !justEvaluated) {
    calculate();
  }
  previous = current;
  operator = op;
  current = '0';
  justEvaluated = false;
}

function calculate() {
  if (!operator) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        current = 'Error';
        operator = null;
        previous = '';
        justEvaluated = true;
        return;
      }
      result = a / b;
      break;
  }

  // avoid stuff like 0.1 + 0.2 = 0.30000000000000004
  current = String(parseFloat(result.toFixed(10)));
  operator = null;
  previous = '';
  justEvaluated = true;
}

function deleteLast() {
  if (justEvaluated || current === 'Error') {
    current = '0';
    justEvaluated = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

function clearAll() {
  current = '0';
  previous = '';
  operator = null;
  justEvaluated = false;
}

function percent() {
  if (current === 'Error') return;
  current = String(parseFloat(current) / 100);
}

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.num) appendNumber(btn.dataset.num);
  if (btn.dataset.op) chooseOperator(btn.dataset.op);

  switch (btn.dataset.action) {
    case 'equals': calculate(); break;
    case 'delete': deleteLast(); break;
    case 'clear': clearAll(); break;
    case 'percent': percent(); break;
  }

  updateDisplay();
});

// keyboard support
document.addEventListener('keydown', (e) => {
  if (/^[0-9.]$/.test(e.key)) appendNumber(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  }
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percent();
  else return;

  updateDisplay();
});

updateDisplay();
