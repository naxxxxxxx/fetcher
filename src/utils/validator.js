/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isNumber = (obj) => {
  return obj === +obj
}

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isInt = (obj) => {
  return isNumber(obj) && Number.isInteger(obj)
}

/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isString = (obj) => {
  return obj === `${obj}`
}

/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isBoolean = (obj) => {
  return obj === !!obj
}

/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isArray = (obj) => {
  return Array.isArray(obj)
}

/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
export const isObject = (obj) => {
  return obj !== null && !Array.isArray(obj) && typeof obj === 'object'
}

/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */

export const isFunction = (obj) => {
  return typeof obj === 'function'
}

/**
 * check Object isNull
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
export const isNull = (obj) => {
  return obj === null
}

/**
 * check object is undefined
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
export const isUndefined = (obj) => {
  return obj === undefined
}
