import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requiredGrade } from '../src/gradeMath.js';
test('la nota recomendada no queda por debajo del umbral por redondear', () => {
  const partial=4*0.33, required=requiredGrade(partial,67);
  assert.equal(required,4);
  assert.ok(partial+required*0.67>=3.95);
});
test('no eleva un decimal exacto por errores de coma flotante',()=>assert.equal(requiredGrade(1.9,50),4.1));
test('rechaza ponderación vacía o no finita',()=>{
  for (const p of [0,-1,101,NaN,Infinity]) assert.throws(()=>requiredGrade(2,p),RangeError);
});
