;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-bug" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M969.142857 548.571429q0 14.848-10.861714 25.709714t-25.709714 10.861714l-128 0q0 97.718857-38.290286 165.705143l118.857143 119.442286q10.861714 10.861714 10.861714 25.709714t-10.861714 25.709714q-10.276571 10.861714-25.709714 10.861714t-25.709714-10.861714l-113.152-112.566857q-2.852571 2.852571-8.557714 7.424t-23.990857 16.274286-37.156571 20.845714-46.848 16.566857-55.442286 7.424l0-512-73.142857 0 0 512q-29.147429 0-58.002286-7.716571t-49.700571-18.870857-37.705143-22.272-24.868571-18.578286l-8.557714-8.009143-104.557714 118.272q-11.446857 11.995429-27.428571 11.995429-13.714286 0-24.576-9.142857-10.861714-10.276571-11.702857-25.417143t8.850286-26.587429l115.419429-129.718857q-33.133714-65.133714-33.133714-156.562286l-128 0q-14.848 0-25.709714-10.861714t-10.861714-25.709714 10.861714-25.709714 25.709714-10.861714l128 0 0-168.009143-98.852571-98.852571q-10.861714-10.861714-10.861714-25.709714t10.861714-25.709714 25.709714-10.861714 25.709714 10.861714l98.852571 98.852571 482.304 0 98.852571-98.852571q10.861714-10.861714 25.709714-10.861714t25.709714 10.861714 10.861714 25.709714-10.861714 25.709714l-98.852571 98.852571 0 168.009143 128 0q14.848 0 25.709714 10.861714t10.861714 25.709714zM694.857143 219.428571l-365.714286 0q0-75.995429 53.430857-129.426286t129.426286-53.430857 129.426286 53.430857 53.430857 129.426286z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-tubiaoleixingzhengchang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M64 448 320 448 320 960 64 960 64 448 64 448ZM704 256 960 256 960 960 704 960 704 256 704 256ZM384 64 640 64 640 960 384 960 384 64 384 64Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zonghe" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M770.56 460.8l250.88 0C998.4 220.16 803.84 25.6 563.2 2.56l0 250.88C668.16 273.92 750.08 355.84 770.56 460.8L770.56 460.8zM770.56 460.8"  ></path>' +
    '' +
    '<path d="M460.8 253.44 460.8 2.56C220.16 25.6 25.6 220.16 2.56 460.8l250.88 0C273.92 355.84 355.84 273.92 460.8 253.44L460.8 253.44zM460.8 253.44"  ></path>' +
    '' +
    '<path d="M563.2 770.56l0 250.88c243.2-23.04 435.2-217.6 460.8-460.8l-250.88 0C750.08 668.16 668.16 750.08 563.2 770.56L563.2 770.56zM563.2 770.56"  ></path>' +
    '' +
    '<path d="M253.44 563.2 2.56 563.2c23.04 243.2 217.6 435.2 460.8 460.8l0-250.88C355.84 750.08 273.92 668.16 253.44 563.2L253.44 563.2zM253.44 563.2"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-404" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M931.6 585.6l0 79c28.6-60.2 44.8-127.4 44.8-198.4C976.4 211 769.4 4 514.2 4S52 211 52 466.2c0 3.2 0.2 6.4 0.2 9.6l166-206 96.4 0L171.8 485.6l46.4 0 0-54.8 99.2-154.6 0 209.4 0 100 0 82.4-99.2 0 0-82.4L67.6 585.6c43 161 170.6 287.4 332.4 328.6-10.4 26.2-40.6 89.4-90.8 100.6-62.2 14 168.8 3.4 333.6-104.6 126.6-36.6 230.8-125.8 287.4-242.2l-97.6 0 0-82.4-166.2 0 0-87.2 0-12.8L666.4 476l166.2-206.2 94 0-140.4 215.8 46.4 0 0-59 99.2-154 0 213.2L931.8 585.6zM366.2 608c-4.8-11.2-7.2-23.2-7.2-36L359 357.6c0-12.8 2.4-24.8 7.2-36 4.8-11.2 11.4-21 19.6-29.2 8.2-8.2 18-14.8 29.2-19.6 11.2-4.8 23.2-7.2 36-7.2l81.6 0c12.8 0 24.8 2.4 36 7.2 11 4.8 20.6 11.2 28.8 19.2l-88.6 129.4 0-23c0-4.8-1.6-8.8-4.8-12-3.2-3.2-7.2-4.8-12-4.8-4.8 0-8.8 1.6-12 4.8-3.2 3.2-4.8 7.2-4.8 12l0 72L372.6 620C370.2 616.2 368 612.2 366.2 608zM624.4 572c0 12.8-2.4 24.8-7.2 36-4.8 11.2-11.4 21-19.6 29.2-8.2 8.2-18 14.8-29.2 19.6-11.2 4.8-23.2 7.2-36 7.2l-81.6 0c-12.8 0-24.8-2.4-36-7.2-11.2-4.8-21-11.4-29.2-19.6-3.6-3.6-7-7.8-10-12l99.2-144.6 0 50.6c0 4.8 1.6 8.8 4.8 12 3.2 3.2 7.2 4.8 12 4.8 4.8 0 8.8-1.6 12-4.8 3.2-3.2 4.8-7.2 4.8-12l0-99.6 92.6-135.2c6.6 7.4 12 15.8 16 25.2 4.8 11.2 7.2 23.2 7.2 36L624.2 572z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-theme" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M788.00002 159.831491C756.00002 128 746 128 724.3801 128L642 128C642 128 576 188.923077 512 188.923077 448 188.923077 384 128 384 128L299.204802 128C276.629934 128 266 140.923077 245.847214 159.831491L81.582979 323.871735C70.243732 335.19552 52 371.692308 81.582979 408.655004 81.582979 408.655004 224.023667 540.29784 238.000003 541.53846L238.000003 835.076924C238.000003 868.452352 286.579 896 320 896L706 896C739.419808 896 788.00002 868.452352 788.00002 835.076924L788.00002 541.53846C802.145492 540.385864 942.448564 408.654992 942.448564 408.654992 974.00002 372 965.851264 334.883878 942.448584 311.513109L788.00002 159.831491Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-EXCEL" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M625.664 132.608V199.68h309.76v43.008h-309.76V312.32h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.096h309.76v43.008h-309.76v89.088H1024v-757.76h-398.336zM0 914.944L577.024 1024V0L0 109.056"  ></path>' +
    '' +
    '<path d="M229.376 660.48H139.776l118.272-187.904-112.64-180.736h92.16l65.536 119.808L370.688 291.84h89.088l-112.64 177.664L466.944 660.48H373.248l-70.144-125.44L229.376 660.48z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-zujian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M568.6 0h454.9v454.9H568.6V0z m0 568.6h454.9v454.9H568.6V568.6zM0 568.6h454.9v454.9H0V568.6zM0 0h454.9v454.9H0V0z" fill="" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)