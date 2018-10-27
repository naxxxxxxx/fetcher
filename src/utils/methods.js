import {
  isNumber,
  isInt,
  isString,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isNull,
  isUndefined,
  validateArgs
} from './generator'

import { toNumber, toString } from './transformer'

const validatorArray = {
  isNumber: [isNumber],
  isInt: [isInt],
  isString: [isString],
  isBoolean: [isBoolean],
  isArray: [isArray],
  isObject: [isObject],
  isFunction: [isFunction],
  isNull: [isNull],
  isUndefined: [isUndefined]
}
const transformerArray = { toNumber, toString }

class Method {
  constructor(options, provider) {
    const {
      name, call, params, transformer, isSendJson, endpoint
    } = options
    this.provider = provider
    this.name = name
    this.call = call
    this.params = params
    this.endpoint = endpoint || 'client'
    this.transformer = transformer || {}
    this.isSendJson = isSendJson || false
  }

  generateValidateObjects = () => {
    const validatorObject = this.params

    const requiredArgs = {}
    const optionalArgs = {}
    for (const index in validatorObject) {
      if (index !== undefined) {
        const newObjectKey = index
        const newObjectValid = validatorObject[index][0]
        const isRequired = validatorObject[index][1]
        if (isRequired === 'required') {
          requiredArgs[newObjectKey] = validatorArray[newObjectValid]
        } else {
          optionalArgs[newObjectKey] = validatorArray[newObjectValid]
        }
      }
    }
    return { requiredArgs, optionalArgs }
  }

  validateArgs = (args, requiredArgs, optionalArgs) => {
    const reArgs = requiredArgs === undefined ? {} : requiredArgs
    const opArgs = optionalArgs === undefined ? {} : optionalArgs
    if (args && this.params !== {}) {
      return validateArgs(args, reArgs, opArgs)
    }
    return true
  }

  extractParams = (args) => {
    const paramsObject = isObject(args) ? args : {}
    let result
    const keyArrayLength = Object.keys(paramsObject).length

    if (keyArrayLength === 0) result = []
    if (keyArrayLength === 1 && !this.isSendJson) {
      const resultKey = Object.keys(paramsObject)[0]
      result = [this.transformedBeforeSend(paramsObject[resultKey], resultKey)]
    } else if (keyArrayLength > 0 && this.isSendJson) {
      const newObject = {}
      Object.keys(paramsObject).map((k) => {
        newObject[k] = this.transformedBeforeSend(paramsObject[k], k)
        return false
      })
      result = newObject
    }
    return result
  }

  transformedBeforeSend = (value, key) => {
    const transformMethod = this.transformer[key]
    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value)
    } else return value
  }

  assignToObject = (object) => {
    const newObject = {}
    newObject[this.name] = this.methodBuilder()
    return Object.assign(object, newObject)
  }

  methodBuilder = () => {
    if (this.provider !== null && this.endpoint === 'client') {
      return (args, callback) => {
        const { requiredArgs, optionalArgs } = this.generateValidateObjects()
        this.validateArgs(args, requiredArgs, optionalArgs)
        const params = this.extractParams(args)
        const newCallback = isFunction(args) ? args : callback
        if (newCallback) {
          return this.provider.send({ method: this.call, params }, newCallback)
        }
        return this.provider.send({ method: this.call, params })
      }
    }
    if (this.provider !== null && this.endpoint !== 'client') {
      return (args, callback) => {
        const { requiredArgs, optionalArgs } = this.generateValidateObjects()
        this.validateArgs(args, requiredArgs, optionalArgs)
        const params = this.extractParams(args)
        const newCallback = isFunction(args) ? args : callback
        if (newCallback) {
          return this.provider.sendServer(this.endpoint, { method: this.call, params }, newCallback)
        }
        return this.provider.sendServer(this.endpoint, { method: this.call, params })
      }
    }
  }
}

export default Method
