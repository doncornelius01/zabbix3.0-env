const functions = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  sqrt: Math.sqrt, ln: Math.log, log: Math.log10, abs: Math.abs,
};

export function calculate(source) {
  const tokens = source.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[a-z]+|[()+\-*/^%]/gi) || [];
  if (tokens.join('') !== source.replace(/\s/g, '') || !tokens.length) throw new Error('Enter a valid expression');
  let position = 0;
  const peek = () => tokens[position];
  function primary() {
    const token = tokens[position++];
    if (token === '(') {
      const value = expression();
      if (tokens[position++] !== ')') throw new Error('Missing closing parenthesis');
      return value;
    }
    if (token === 'pi') return Math.PI;
    if (token === 'e') return Math.E;
    if (Object.hasOwn(functions, token)) {
      if (tokens[position++] !== '(') throw new Error('Functions need parentheses');
      const value = expression();
      if (tokens[position++] !== ')') throw new Error('Missing closing parenthesis');
      return functions[token](value);
    }
    if (token === undefined || !/^(?:\d|\.)/.test(token)) throw new Error('Expected a number');
    return Number(token);
  }
  function postfix() {
    let value = primary();
    while (peek() === '%') { position++; value /= 100; }
    return value;
  }
  function power() {
    const value = postfix();
    if (peek() === '^') { position++; return value ** unary(); }
    return value;
  }
  function unary() {
    if (peek() === '+') { position++; return unary(); }
    if (peek() === '-') { position++; return -unary(); }
    return power();
  }
  function product() {
    let value = unary();
    while (peek() === '*' || peek() === '/') {
      const operator = tokens[position++];
      const right = unary();
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  }
  function expression() {
    let value = product();
    while (peek() === '+' || peek() === '-') {
      const operator = tokens[position++];
      const right = product();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }
  const result = expression();
  if (position !== tokens.length) throw new Error('Check your expression');
  if (!Number.isFinite(result)) throw new Error('Result is outside the real number range');
  return result;
}

export function format(value, scientific = false) {
  if (scientific) return value.toExponential(8);
  if (Math.abs(value) >= 1e12 || (value !== 0 && Math.abs(value) < 1e-8)) {
    return Number(value.toPrecision(12)).toExponential();
  }
  return String(Number(value.toPrecision(12)));
}
