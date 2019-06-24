import math from '../../src/utils/math'

test('check degToAngle', () => {
  expect(math.degToAngle(0)).toBe(0)
  expect(math.degToAngle(45)).toBe(Math.PI / 4)
  expect(math.degToAngle(90)).toBe(Math.PI / 2)
  expect(math.degToAngle(180)).toBe(Math.PI)
})

test('check angleToDeg', () => {
  expect(math.angleToDeg(0)).toBe(0),
  expect(math.angleToDeg(Math.PI / 4)).toBe(45)
  expect(math.angleToDeg(Math.PI / 2)).toBe(90)
  expect(math.angleToDeg(Math.PI)).toBe(180)
})