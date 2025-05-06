import { hash } from './hash';

describe('hash', () => {

  test('hello world', () => {
    expect(hash('console.log("hello world");')).toBe('1b199d6fe5dd21237f4e120c92ddfac7');
  })

  test('hello world (bad whitespace)', () => {
    expect(hash('   console.log    ("hello     world" )     ;  ')).toBe('1b199d6fe5dd21237f4e120c92ddfac7');
  })

  test('hello world (three lines)', () => {
    expect(hash('console.log(\n\t"helloworld"\n);\n\n')).toBe('eb3379381687eb18e639808b2a84dca3');
  })

  test('hello world (three lines; bad whitespace)', () => {
    expect(hash('\t   \tconsole.log(   \n\t\t    "helloworld    "\n);    \n   \n\t\n\t\n \t   ')).toBe('eb3379381687eb18e639808b2a84dca3');
  })

})