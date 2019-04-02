import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'
describe('Hamburger.vue', () => {
  it('toggle click', () => {
    const wrapper = shallowMount(Hamburger)
    const mockFn = jest.fn()
    wrapper.vm.$on('toggleClick', mockFn)
    wrapper.find('.hamburger').trigger('click')
    expect(mockFn).toBeCalled()
  })
  it('prop isActive', () => {
    const wrapper = shallowMount(Hamburger)
    wrapper.setProps({ isActive: true })
    expect(wrapper.contains('.is-active')).toBe(true)
    wrapper.setProps({ isActive: false })
    expect(wrapper.contains('.is-active')).toBe(false)
  })
})
