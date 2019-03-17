import login from './login'
import article from './article'
import search from './remoteSearch'
import transaction from './transaction'
import role from './role'

export default {
  ...login,
  ...article,
  ...search,
  ...transaction,
  ...role
}

