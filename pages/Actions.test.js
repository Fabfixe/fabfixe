import React from 'react'
import { shallow } from 'enzyme'
import Actions from './Actions'

let addFriends = jest.fn()
let manageFriends = jest.fn()
const wrapper = shallow(<Actions addFriends={addFriends} manageFriends={manageFriends} />)

describe('Action Buttons', () => {
  beforeEach(() => {
    addFriends.mockClear()
    manageFriends.mockClear()
  })

  it('should render a manage button', () => {
    expect(wrapper.find('.lbd-actions__manage').text()).toBe('Manage Friends')
  })

  it('should render an add friends button', () => {
    expect(wrapper.find('.lbd-actions__add').text()).toBe('Add Friends')
  })

  it('should have a "Add Friends" click handler', () => {
    wrapper.find('.lbd-actions__add').simulate('click')
    expect(addFriends).toHaveBeenCalled()
    expect(manageFriends).not.toHaveBeenCalled()
  })

  it('should have a "Manage Friends" click handler', () => {
    wrapper.find('.lbd-actions__manage').simulate('click')
    expect(addFriends).not.toHaveBeenCalled()
    expect(manageFriends).toHaveBeenCalled()
  })
})
