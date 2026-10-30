import { calculate, format } from './calculator.js';

const input = document.querySelector('#expression');
const output = document.querySelector('#result');
const message = document.querySelector('#message');
let memory = null;
let answer = 0;
let scientific = false;
let history = [];

function insert(text) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  input.setRangeText(text, start, end, 'end');
  input.focus();
  message.textContent = 'Ready when you are.';
}
function evaluate(record = true) {
  try {
    const expression = input.value.trim() || '0';
    const value = calculate(expression);
    answer = value;
    output.textContent = format(value, scientific);
    message.textContent = 'A little clarity. There you go.';
    if (record) {
      history.unshift({ expression, value });
      history = history.slice(0, 8);
      renderHistory();
    }
    return value;
  } catch (error) {
    message.textContent = error.message;
    return null;
  }
}
function renderHistory() {
  const list = document.querySelector('#history-list');
  list.replaceChildren();
  if (!history.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'A fresh start. Your calculations will appear here.';
    list.append(empty);
  }
  for (const item of history) {
    const button = document.createElement('button');
    button.className = 'history-item';
    const expression = document.createElement('span');
    expression.textContent = item.expression;
    const result = document.createElement('strong');
    result.textContent = '= ' + format(item.value, scientific);
    button.append(expression, result);
    button.addEventListener('click', () => { input.value = item.expression; evaluate(false); input.focus(); });
    list.append(button);
  }
}
document.querySelector('.calculator').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.insert) return insert(button.dataset.insert);
  const action = button.dataset.action;
  if (action === 'equals') evaluate();
  if (action === 'clear') { input.value = ''; output.textContent = '0'; message.textContent = 'A fresh start.'; input.focus(); }
  if (action === 'backspace') {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.setRangeText('', start === end ? Math.max(0, start - 1) : start, end, 'end');
    input.focus();
  }
  if (action === 'sign') { input.value = input.value ? '-(' + input.value + ')' : '-'; input.focus(); }
  if (action === 'ans') insert(String(answer));
  if (action === 'mc') memory = null;
  if (action === 'mr' && memory !== null) insert('(' + memory + ')');
  if (['ms', 'mplus', 'mminus'].includes(action)) {
    const value = evaluate(false);
    if (value !== null) {
      const next = action === 'ms' ? value : (memory ?? 0) + (action === 'mminus' ? -value : value);
      if (Number.isFinite(next)) memory = next;
      else message.textContent = 'Memory value is outside the supported range';
    }
  }
  document.querySelector('#memory-indicator').textContent = memory === null ? 'MEMORY EMPTY' : 'M · ' + format(memory, scientific);
});
document.querySelector('#notation').addEventListener('click', event => {
  scientific = !scientific;
  event.currentTarget.setAttribute('aria-pressed', scientific);
  event.currentTarget.querySelector('span').textContent = scientific ? 'ON' : 'OFF';
  output.textContent = format(answer, scientific);
  document.querySelector('#memory-indicator').textContent = memory === null ? 'MEMORY EMPTY' : 'M · ' + format(memory, scientific);
  renderHistory();
});
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); evaluate(); }
  if (event.key === 'Escape') { input.value = ''; output.textContent = '0'; message.textContent = 'A fresh start.'; }
});
document.querySelector('#clear-history').addEventListener('click', () => { history = []; renderHistory(); });
