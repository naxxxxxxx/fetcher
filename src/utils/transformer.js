import {
  validateTypes,
  isNumber,
  isInt,
  isString,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isNull,
  isUndefined
} from './generator'

export const toString = (string) => {
  validateTypes(string, [
    isNumber,
    isInt,
    isString,
    isBoolean,
    isArray,
    isObject,
    isFunction,
    isNull,
    isUndefined
  ])
  try {
    if (isArray(string) || isObject(string)) {
      return JSON.stringify(string)
    }
    return String(string)
  } catch (e) {
    throw new Error(e)
  }
}
export const toNumber = (string) => {
  validateTypes(string, [isNumber, isInt, isString, isBoolean, isNull, isUndefined])
  try {
    return Number(string)
  } catch (e) {
    throw new Error(e)
  }
}
