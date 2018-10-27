export default [
  {
    name: 'testPost',
    call: 'TESTPOST',
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
    endpoint: 'testPost'
  }
]
