// This class is used for evaluate a conditional
// format := {expression} [{logic} {expression}]<br>
// expression := @{context}@{operand}{value} or @{context}@{operand}{value}<br>
// logic := {|}|{&}<br>
// context := any global or window context <br>
// value := strings or numbers<br>
// logic operators	:= AND or OR with the previous result from left to right <br>
// operand := eq{=}, gt{&gt;}, le{&lt;}, not{~^!} <br>
// Examples: <br>
// @AD_Table_ID@=14 | @Language@!GERGER <br>
// @PriceLimit@>10 | @PriceList@>@PriceActual@<br>
// @Name@>J<br>
// Strings may be in single quotes (optional)
class evaluator {
  /**
   * Evaluate logic's
   * @param {string} parentUuid Parent (Window / Process / Smart Browser)
   */
  static evaluateLogic(objectToEvaluate) {
    var defaultUndefined = false
    if (objectToEvaluate.type === 'displayed') {
      defaultUndefined = true
    }
    // empty logic
    if (objectToEvaluate.logic === undefined ||
      objectToEvaluate.logic === null ||
      objectToEvaluate.logic.trim() === '') {
      return defaultUndefined
    }
    var st = objectToEvaluate.logic.trim().replace('\n', '')
    st = st.replace('|', '~')
    var expr = /(~|&)/
    var stList = st.split(expr)
    var it = stList.length

    if (((it / 2) - ((it + 1) / 2)) === 0) {
      console.info(
        'Logic does not comply with format "<expression> [<logic> <expression>]"' +
        '  -->  ' + objectToEvaluate.logic
      )
      return defaultUndefined
    }

    var retValue = null
    var logOp = ''
    stList.forEach(function(element) {
      if (element === '~' || element === '&') {
        logOp = element
      } else if (retValue === null) {
        retValue = evaluator.evaluateLogicTuples({
          ...objectToEvaluate,
          conditional: element
        })
      } else {
        if (logOp === '&' && logOp !== '') {
          retValue = retValue & evaluator.evaluateLogicTuples({
            ...objectToEvaluate,
            conditional: element
          })
        } else if (logOp === '~' && logOp !== '') {
          retValue = retValue | evaluator.evaluateLogicTuples({
            ...objectToEvaluate,
            conditional: element
          })
        } else {
          console.info("Logic operant '|' or '&' expected  -->  " + objectToEvaluate.logic)
          return defaultUndefined
        }
      }
    })
    return Boolean(retValue)
  } //  evaluateLogic

  /**
   * Evaluate Logic Tuples
   * @param {object} objectToEvaluate Complete object
   * @param {string} logic If is displayed or not (mandatory and readonly)
   * @return {boolean}
   */
  static evaluateLogicTuples(objectToEvaluate) {
    var _defaultUndefined = false
    if (objectToEvaluate.type === 'displayed') {
      _defaultUndefined = true
    }
    var logic = objectToEvaluate.conditional
    // not context info, not logic
    if (logic === undefined) {
      return _defaultUndefined
    }
    var expr = /^(['"@#$a-zA-Z0-9\-_\s]){0,}((!*={1})|(!{1})|(<{1})|(>{1}))([\s"'@#$a-zA-Z0-9\-_]){0,}$/i
    var st = expr.test(logic)

    if (!st) {
      console.info(
        ".Logic tuple does not comply with format '@context@=value' where operand" +
        " could be one of '=!^><'  -->  " + logic
      )
      return _defaultUndefined
    }
    expr = /(!{1}|={1})/
    st = logic.split(expr)
    if (st.length === 1) {
      expr = /(<{1})/
      st = logic.split(expr)
    }
    if (st.length === 1) {
      expr = /(>)/
      st = logic.split(expr)
    }
    // First Part (or column name)
    var first = st[0].trim()
    var firstEval = first
    expr = /@/
    if (expr.test(first)) {
      first = first.replace(/@/g, '').trim()
      var isGlobal = first.startsWith('#')
      var isCountable = first.startsWith('$')
      var value = objectToEvaluate.context.getContext({
        parentUuid: (isGlobal || isCountable) ? '' : objectToEvaluate.parentUuid,
        containerUuid: (isGlobal || isCountable) ? '' : objectToEvaluate.containerUuid,
        columnName: first
      })
      // in context exists this column name
      if (value === null || value === undefined) {
        console.info(
          '.The column ' + first + ' not exists in context.'
        )
        return _defaultUndefined
      }
      firstEval = value	// replace with it's value
    }

    if (firstEval === null || firstEval === undefined) {
      return _defaultUndefined
    }
    if (typeof firstEval === 'string') {
      firstEval = firstEval.replace(/['"]/g, '').trim()	// strip ' and "
    }

    //	Operator
    var operand = st[1]
    //	Second Part
    var second = st[2].trim()
    var secondEval = second.trim()
    if (expr.test(second)) {
      second = second.replace(/@/g, ' ').trim() // strip tag
      secondEval = objectToEvaluate.context.getContext({
        parentUuid: (isGlobal || isCountable) ? null : objectToEvaluate.parentUuid,
        containerUuid: (isGlobal || isCountable) ? null : objectToEvaluate.containerUuid,
        columnName: first
      })	//	replace with it's value
    }
    if (typeof secondEval === 'string') {
      secondEval = secondEval.replace(/['"]/g, '').trim()	//	strip ' and " for string values
    }

    //	Handling of ID compare (null => 0)
    if (first.includes('_ID') && firstEval.length === 0) {
      firstEval = '0'
    }
    if (second.includes('_ID') && secondEval.length === 0) {
      secondEval = '0'
    }

    //	Logical Comparison
    var result = this.evaluateLogicTuple(firstEval, operand, secondEval)

    return result
  }

  /**
   * Evuale logic Tuple
   * @param {string|number} value1 Value in Context
   * @param {string} operand Comparison
   * @param {string|number} value2 Value in Logic
   * @return {boolean}
   */
  static evaluateLogicTuple(value1, operand, value2) {
    // Convert value 1 string value to boolean value
    if (value1 === 'Y') {
      value1 = true
    } else if (value1 === 'N') {
      value1 = false
    }

    // Convert value 2 string value to boolean value
    if (value2 === 'Y') {
      value2 = true
    } else if (value2 === 'N') {
      value2 = false
    }

    if (value1 == null || operand == null || value2 == null) {
      return false
    }
    if (operand === '=') {
      return value1 === value2
    } else if (operand === '<') {
      return value1 < value2
    } else if (operand === '>') {
      return value1 > value2
    } else {
      //	interpreted as not
      return value1 !== value2
    }
  }

  /**
   * Parse Depends or relations
   * @param {string} parseString
   * @return {array}
   */
  static parseDepends(parseString) {
    var listFields = []
    if (parseString === null || parseString === undefined) {
      // return array empty
      return listFields
    }

    let string = parseString.replace('@SQL=', '')
    //  while we have variables

    while (string.includes('@')) {
      let pos = string.indexOf('@')
      // remove first @: @ExampleColumn@ = ExampleColumn@
      string = string.substring(pos + 1)

      pos = string.indexOf('@')
      if (pos === -1) {
        continue
      }	//	error number of @@ not correct

      // remove second @: ExampleColumn@ = ExampleColumn
      const value = string.substring(0, pos)

      // delete secodn columnName and @
      string = string.substring(pos + 1)

      // add column name in array
      listFields.push(value)
    }
    return listFields
  }
}

export default evaluator
