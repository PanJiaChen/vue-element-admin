function deepClone(d) {
  return JSON.parse(JSON.stringify(d))
}

function genNav(items, type = 'EN') {
  return items.filter(v => {
    if (v.type && v.type !== type) return false

    if (v[`text${type}`]) {
      v.text = v[`text${type}`]
    }

    if (type != 'EN' && v.link && !isExternalLink(v.link)) {
      v.link = `/${type.toLocaleLowerCase()}${v.link}`
    }

    if (v.items && v.items.length > 0) {
      v.items = genNav(v.items, type)
    }

    return v
  })
}

function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%*$#=~_-]+))*$/
  return urlregex.test(textval)
}

function isExternalLink(routePath) {
  return validateURL(routePath)
}

function getComponentSidebar(item, type = 'EN') {
  return item[0].items.map(v => {
    if (type != 'EN' && v.link && !isExternalLink(v.link)) {
      v.link = `/${type.toLocaleLowerCase()}${v.link}`
    }
    return v.link
  })
}

module.exports = {
  genNav,
  getComponentSidebar,
  deepClone
}
