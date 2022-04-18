<script>
/** 通过URL 缓存页面
 *  日期:2020/8/4
 */
var cache = Object.create(null)
var keys = []
function remove(keys, key) {
  if (keys && key) {
    var index = keys.indexOf(key)
    if (index !== -1) {
      keys.splice(index, 1)
    }
  }
}
/**
 * 修剪缓存
 */
function pruneCache(keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      if (!filter(key)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
/**
 * 修剪缓存入口
 */
function pruneCacheEntry(cache, key, keys, current) {
  const cached = cache[key]
  // 主动执行某个组件的destory，触发destroy钩子，达到销毁目的，然后移除缓存中的key-value
  cached && cached.componentInstance.$destroy()
  cache[key] = null
  remove(keys, key)
}

export default {
  name: 'VKeepAlive',
  // 抽象组件
  abstract: true,
  props: {
    keyarray: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  created() {
    // 组件创建时创建缓存对象
    this.cache = cache
    this.keys = keys
  },
  mounted() {
    this.$watch('keyarray', val => {
      // 销毁不在key数组的对象
      pruneCache(this, name => val.some(v => v === name))
    })
  },

  render() {
    const slot = this.$slots.default
    const vnode = slot[0]
    const componentOptions = vnode && vnode.componentOptions
    this.$vnode.componentOptions.Ctor.options.abstract = true
    if (componentOptions) {
      const { cache, keys } = this
      const key =
        vnode.key.indexOf('__transition') === 0 ? vnode.data.key : vnode.key
      var isCache =
        this.keyarray.filter(v => {
          return v === key
        }).length === 0
      if (isCache) {
        vnode.data.keepAlive = false
      } else {
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance
          remove(keys, key)
          keys.push(key)
        } else {
          cache[key] = vnode
          keys.push(key)
        }
        vnode.data.keepAlive = true
      }
    }
    return vnode || (slot && slot[0])
  }
}
</script>
