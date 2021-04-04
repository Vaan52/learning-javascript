const ivan = require('./index.js');

let counter = 1;

async function test (input, expected) {
  const id = counter;
  counter++;

  let success = false;

  try {
    const result = await ivan.evaluateExpression(input);
    
    if (result !== expected) {
      throw Error(`Result not expected: ${input} should evaluate to ${expected} and not ${result}`);
    }

    success = true;
  }
  catch (err) {
    console.error(err);
  }

  console.log(`Case ${id}: ${success ? 'Success' : 'Failed'}`);
}

async function testCases () {
  await test('1 + 1', 2);
  await test('1-2', -1);
  await test('5    *  4', 20);
  await test(' 18/ 6 ', 3);
  await test('4 ^ 3', 64);
  await test('1.005 + 1.003', 2.008);
  await test(' ( 525600 ) ', 525600);
  await test('(2) + (3-(2))', 3);

  // https://www.chilimath.com/lessons/introductory-algebra/order-of-operations-practice-problems/
  await test('7 - 24 / 8 * 4 + 6', 1);
  await test('18 / 3 - 7 + 2 * 5', 9);
  await test('6 * 4 / 12 + 72 / 8 - 9', 2);
  await test('(17 - 6/2) + 4*3', 26);
  await test('(3* 5 ^2/15) -(5  -2^ 2) ', 4);
  await test('(1^4*2^2+3^3)-2^5/4', 23);
  await test('(22/2 - 2*5)^ 2+ (4-6/6)^2', 10);
}

testCases()
  .then(() => process.exit(0));