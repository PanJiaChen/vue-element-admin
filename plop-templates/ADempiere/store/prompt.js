const { notEmpty } = require('../../utils.js')

module.exports = {
  description: 'Generate a ADempiere Store Module',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'ADempiere Store Module name: ',
    validate: notEmpty('name')
  },
  {
    type: 'checkbox',
    name: 'blocks',
    message: 'Blocks:',
    choices: [{
      name: 'state',
      value: 'state',
      checked: true
    },
    {
      name: 'mutations',
      value: 'mutations',
      checked: true
    },
    {
      name: 'actions',
      value: 'actions',
      checked: true
    },
    {
      name: 'getters',
      value: 'getters',
      checked: true
    }
    ],
    validate(value) {
      if (value.indexOf('state') === -1 && value.indexOf('mutations') === -1) {
        return 'Store Module require at least a state or mutations.'
      }
      return true
    }
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/store/modules/ADempiere/${name}.js`,
      templateFile: 'plop-templates/ADempiere/store/index.hbs',
      data: {
        name: name,
        state: data.blocks.includes('state'),
        mutations: data.blocks.includes('mutations'),
        actions: data.blocks.includes('actions'),
        getters: data.blocks.includes('getters')
      }
    }]

    return actions
  }
}
