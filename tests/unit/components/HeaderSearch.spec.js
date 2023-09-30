import { shallowMount, createLocalVue } from '@vue/test-utils'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)
describe('HeaderSearch.Vue', () => {
  let getters
  let store
  let state

  beforeEach(() => {
    state = {
      permission: {
        routes: []
      }
    }
    getters = {
      permission_routes: () => []
    }

    store = new Vuex.Store({
      getters,
      state
    })
  })

  it('It mounts', () => {
    const wrapper = shallowMount(HeaderSearch, { store, localVue })
    expect(wrapper.html()).toBeTruthy()
  })

  it('tests click', () => {
    const wrapper = shallowMount(HeaderSearch, { store, localVue })
    wrapper.vm.show = true
    const clickSpy = jest.spyOn(wrapper.vm, 'click')
    wrapper.vm.click()
    expect(clickSpy).toHaveBeenCalled()
    expect(wrapper.vm.show).toEqual(false)
  })

  it('tests change', () => {
    const mockRoute = {
      params: {
        id: 1
      }
    }
    const mockRouter = {
      push: jest.fn()
    }
    const wrapper = shallowMount(HeaderSearch, {
      store,
      localVue,
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter
        }
      }
    })
    const changeSpy = jest.spyOn(wrapper.vm, 'change')
    wrapper.vm.$router = {
      push: jest.fn()
    }
    wrapper.vm.change({ path: 'test' })
    expect(changeSpy).toHaveBeenCalled()
  })
})
