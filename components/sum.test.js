const sum = require('./sum');
import * as React from 'react'

import { shallow, mount, render, debug } from 'enzyme'
const Foo = () => {
  return (
    <div>Hi Carron, you successfully added a test on your own!</div>
  )
}

const wrapper = shallow(<Foo />)
console.log(wrapper.debug())
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
