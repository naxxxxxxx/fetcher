import FetchProvider from './provider/FetchProvider'
import Method from './utils/methods'
import getObjects from './methods/get'
import postObjects from './methods/post'
import * as vals from './utils/generator'

const mapGetToMethods = (main, provider) => {
  getObjects.map((data) => {
    const method = new Method(data, provider)
    method.assignToObject(main)
    return false
  })
}

const mapPostToMethods = (main, provider) => {
  postObjects.map((data) => {
    const reg = new Method(data, provider)
    reg.assignToObject(main)
    return false
  })
}

export default class Fetch {
  constructor(url) {
    this.getProvider = new FetchProvider(url, { method: 'GET' })
    this.postProvider = new FetchProvider(url, { method: 'POST' })
    this.get = {}
    this.post = {}
    mapGetToMethods(this.get, this.getProvider)
    mapPostToMethods(this.post, this.postProvider)
  }

  modules = {
    FetchProvider
  }

  extends(data, type) {
    if (!vals.isObject(data)) {
      throw new TypeError('Extend Method has to be Object')
    }
    if (type === 'GET') {
      return new Method(data, this.getProvider).assignToObject(this.get)
    }
    return new Method(data, this.postProvider).assignToObject(this.post)
  }
}
