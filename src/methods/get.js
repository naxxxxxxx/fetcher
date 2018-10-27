export default [
  {
    name: 'testGET',
    call: 'TESTGET',
    params: {
      param1: ['isString', 'required'],
      param2: ['isString', 'required'],
      param3: ['isString', 'optional'],
      param4: ['isNumber', 'optional']
    },
    transformer: {
      param4: 'toNumber'
    },
    isSendJson: true,
    endpoint: '/testGet'
  }
]
