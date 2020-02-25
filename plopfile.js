const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const ADempiereView = require('./plop-templates/ADempiere/view/prompt')
const ADempiereComponent = require('./plop-templates/ADempiere/component/prompt')
const ADempiereStore = require('./plop-templates/ADempiere/store/prompt')

module.exports = function(plop) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('ADempiere View', ADempiereView)
  plop.setGenerator('ADempiere Component', ADempiereComponent)
  plop.setGenerator('ADempiere Store Module', ADempiereStore)
}
