const dynamicLoadScript = (src, callback) => {
  const existingScript = document.getElementById(src)
  const cb = callback || function() {}

  if (!existingScript) {
    const script = document.createElement('script')
    script.src = src // src url for the third-party library being loaded.
    script.id = src
    document.body.appendChild(script)

    script.onload = () => {
      if (cb) cb(null, script)
    }
    script.onerror = () => {
      cb(new Error('Failed to load ' + src), script)
    }
  }

  if (existingScript && cb) cb()
}

export default dynamicLoadScript
