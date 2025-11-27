<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const nodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        nodes.push(<i class={[icon, 'menu-item-icon']} />)
      } else {
        nodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      nodes.push(<span slot='title'>{title}</span>)
    }
    return nodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
