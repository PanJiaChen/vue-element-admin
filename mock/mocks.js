import login from './login'
import article from './article'
import search from './remoteSearch'
import transaction from './transaction'

export default {
  ...login,
  ...article,
  ...search,
  ...transaction
}

