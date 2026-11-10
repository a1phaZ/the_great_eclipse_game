// Безопасный вычислитель выражений для контент-паков.
//
// Поддерживает:
//   числа, строки, true/false/null;
//   пути состояния: resources.chips, flags.quest.noise, inventory.ammo.qty;
//   + - * / %, сравнения, && || !, тернарник ? :, скобки;
//   функции: min, max, round, floor, ceil, abs, clamp.
//
// Никакого eval: только разбор в AST и обход с явным scope.
// Неизвестные идентификаторы и функции — ошибка (её ловит движок/валидатор).

const CACHE = new Map();

export class ExpressionError extends Error {
  constructor(message, expression, position) {
    super(`${message} (позиция ${position}) в выражении "${expression}"`);
    this.name = 'ExpressionError';
    this.expression = expression;
    this.position = position;
  }
}

function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    // Число
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(input[i + 1]))) {
      const start = i;
      while (i < input.length && /[0-9.]/.test(input[i])) i += 1;
      const raw = input.slice(start, i);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new ExpressionError(`Некорректное число "${raw}"`, input, start);
      }
      tokens.push({ type: 'number', value, pos: start });
      continue;
    }

    // Строка
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const start = i;
      i += 1;
      let value = '';
      while (i < input.length && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < input.length) {
          i += 1;
          const esc = input[i];
          value += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc;
          i += 1;
        } else {
          value += input[i];
          i += 1;
        }
      }
      if (i >= input.length) {
        throw new ExpressionError('Незакрытая строка', input, start);
      }
      i += 1;
      tokens.push({ type: 'string', value, pos: start });
      continue;
    }

    // Идентификатор / путь / ключевое слово
    if (/[A-Za-z_]/.test(ch)) {
      const start = i;
      while (i < input.length && /[A-Za-z0-9_.]/.test(input[i])) i += 1;
      const name = input.slice(start, i);
      if (name === 'true') tokens.push({ type: 'boolean', value: true, pos: start });
      else if (name === 'false') tokens.push({ type: 'boolean', value: false, pos: start });
      else if (name === 'null') tokens.push({ type: 'null', value: null, pos: start });
      else tokens.push({ type: 'identifier', value: name, pos: start });
      continue;
    }

    const two = input.slice(i, i + 2);
    if (['==', '!=', '>=', '<=', '&&', '||'].includes(two)) {
      tokens.push({ type: 'operator', value: two, pos: i });
      i += 2;
      continue;
    }

    if ('+-*/%<>!?:(),'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch, pos: i });
      i += 1;
      continue;
    }

    throw new ExpressionError(`Неожиданный символ "${ch}"`, input, i);
  }

  tokens.push({ type: 'eof', value: null, pos: input.length });
  return tokens;
}

function parse(input) {
  if (CACHE.has(input)) return CACHE.get(input);

  const tokens = tokenize(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = (expected) => {
    const token = tokens[pos];
    if (expected !== undefined && token.value !== expected) {
      throw new ExpressionError(`Ожидалось "${expected}"`, input, token.pos);
    }
    pos += 1;
    return token;
  };
  const match = (value) => {
    if (peek().value === value) {
      pos += 1;
      return true;
    }
    return false;
  };

  function parseExpression() {
    return parseTernary();
  }

  function parseTernary() {
    const condition = parseOr();
    if (match('?')) {
      const consequent = parseExpression();
      consume(':');
      const alternate = parseExpression();
      return { type: 'ternary', condition, consequent, alternate };
    }
    return condition;
  }

  function parseOr() {
    let left = parseAnd();
    while (match('||')) {
      const right = parseAnd();
      left = { type: 'binary', op: '||', left, right };
    }
    return left;
  }

  function parseAnd() {
    let left = parseEquality();
    while (match('&&')) {
      const right = parseEquality();
      left = { type: 'binary', op: '&&', left, right };
    }
    return left;
  }

  function parseEquality() {
    let left = parseComparison();
    while (peek().value === '==' || peek().value === '!=') {
      const op = consume().value;
      const right = parseComparison();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseComparison() {
    let left = parseAdditive();
    while (['>', '>=', '<', '<='].includes(peek().value)) {
      const op = consume().value;
      const right = parseAdditive();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseAdditive() {
    let left = parseMultiplicative();
    while (peek().value === '+' || peek().value === '-') {
      const op = consume().value;
      const right = parseMultiplicative();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseMultiplicative() {
    let left = parseUnary();
    while (['*', '/', '%'].includes(peek().value)) {
      const op = consume().value;
      const right = parseUnary();
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  function parseUnary() {
    if (['!', '-', '+'].includes(peek().value)) {
      const op = consume().value;
      return { type: 'unary', op, argument: parseUnary() };
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();

    if (token.type === 'number' || token.type === 'string' || token.type === 'boolean') {
      pos += 1;
      return { type: 'literal', value: token.value };
    }
    if (token.type === 'null') {
      pos += 1;
      return { type: 'literal', value: null };
    }

    if (token.type === 'identifier') {
      pos += 1;
      if (peek().value === '(') {
        consume('(');
        const args = [];
        if (peek().value !== ')') {
          args.push(parseExpression());
          while (match(',')) args.push(parseExpression());
        }
        consume(')');
        return { type: 'call', name: token.value, args };
      }
      return { type: 'identifier', name: token.value };
    }

    if (match('(')) {
      const expression = parseExpression();
      consume(')');
      return expression;
    }

    throw new ExpressionError('Неожиданный токен', input, token.pos);
  }

  const ast = parseExpression();
  if (peek().type !== 'eof') {
    throw new ExpressionError(`Лишний токен "${peek().value}"`, input, peek().pos);
  }

  CACHE.set(input, ast);
  return ast;
}

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value === null || value === undefined) return 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function truthy(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0 && !Number.isNaN(value);
  if (typeof value === 'string') return value.length > 0;
  return Boolean(value);
}

function compare(left, right) {
  if (typeof left === 'string' && typeof right === 'string') {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  const a = toNumber(left);
  const b = toNumber(right);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return a < b ? -1 : a > b ? 1 : 0;
}

function equal(left, right) {
  if (left === right) return true;
  if (typeof left === 'string' || typeof right === 'string') return false;
  return toNumber(left) === toNumber(right);
}

function evaluateAst(node, scope) {
  switch (node.type) {
    case 'literal':
      return node.value;

    case 'identifier':
      return scope.get(node.name);

    case 'call':
      return scope.call(node.name, node.args.map((arg) => evaluateAst(arg, scope)));

    case 'unary': {
      const value = evaluateAst(node.argument, scope);
      if (node.op === '!') return !truthy(value);
      if (node.op === '-') return -toNumber(value);
      return toNumber(value);
    }

    case 'ternary':
      return truthy(evaluateAst(node.condition, scope))
        ? evaluateAst(node.consequent, scope)
        : evaluateAst(node.alternate, scope);

    case 'binary': {
      const { op } = node;

      if (op === '&&') {
        return truthy(evaluateAst(node.left, scope))
          && truthy(evaluateAst(node.right, scope));
      }
      if (op === '||') {
        return truthy(evaluateAst(node.left, scope))
          || truthy(evaluateAst(node.right, scope));
      }

      const left = evaluateAst(node.left, scope);
      const right = evaluateAst(node.right, scope);

      switch (op) {
        case '+':
          if (typeof left === 'string' || typeof right === 'string') {
            return String(left) + String(right);
          }
          return toNumber(left) + toNumber(right);
        case '-':
          return toNumber(left) - toNumber(right);
        case '*':
          return toNumber(left) * toNumber(right);
        case '/': {
          const divisor = toNumber(right);
          return divisor === 0 ? 0 : toNumber(left) / divisor;
        }
        case '%': {
          const divisor = toNumber(right);
          return divisor === 0 ? 0 : toNumber(left) % divisor;
        }
        case '==':
          return equal(left, right);
        case '!=':
          return !equal(left, right);
        case '>':
          return compare(left, right) > 0;
        case '>=':
          return compare(left, right) >= 0;
        case '<':
          return compare(left, right) < 0;
        case '<=':
          return compare(left, right) <= 0;
        default:
          throw new Error(`Неизвестный оператор "${op}"`);
      }
    }

    default:
      throw new Error(`Неизвестный узел выражения "${node.type}"`);
  }
}

export function evaluateExpression(expression, scope) {
  const source = String(expression ?? '').trim();
  if (source === '') return undefined;
  return evaluateAst(parse(source), scope);
}

export function parseExpression(expression) {
  return parse(String(expression ?? '').trim());
}

export function isValidExpression(expression) {
  try {
    parseExpression(expression);
    return true;
  } catch {
    return false;
  }
}

export { toNumber, truthy };
