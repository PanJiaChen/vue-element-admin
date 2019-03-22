const notEmpty = name => {
  return v => {
    if (!v || v.trim === '') {
      return `${name} is required`
    } else {
      return true
    }
  }
}

module.exports = function(plop) {
  const name = '{{ properCase name }}'
  plop.setGenerator('component', {
    description: 'generate vue component',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'component name please',
      validate: notEmpty('name')
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [
        {
          name: '<template>',
          value: 'template',
          checked: true
        },
        {
          name: '<script>',
          value: 'script',
          checked: true
        },
        {
          name: '<style>',
          value: 'style',
          checked: true
        }
      ],
      validate(value) {
        if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
          return 'Components require at least a <script> or <template> tag.'
        }
        return true
      }
    }
    ],
    actions: [{
      type: 'add',
      path: `src/components/${name}/index.vue`,
      templateFile: 'plop-templates/component/index.vue',
      data: {
        banana: 'banana'
      }
    }]
  })

  plop.setGenerator('none', {})
}
