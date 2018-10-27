import fetch from 'cross-fetch'

const DEFAULT_TIMEOUT = 120000

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

function _fetch(fetchPromise, timeout) {
  let abortFn = null

  const abortPromise = new Promise((resolve, reject) => {
    abortFn = () => reject(new Error(`request Timeout in ${timeout} ms`))
  })
  const abortablePromise = Promise.race([fetchPromise, abortPromise])

  setTimeout(() => {
    abortFn()
  }, timeout)

  return abortablePromise
}

const execParams = (url, params) => {
  const paramsArray = []
  let newUrl = url
  // 拼接参数
  Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`))
  if (url.search(/\?/) === -1) {
    newUrl += `?${paramsArray.join('&')}`
  } else {
    newUrl += `&${paramsArray.join('&')}`
  }
  console.log(params)
  return newUrl
}

export const performRPC = async (request, handler) => {
  try {
    const response = await _fetch(
      fetch(
        request.options.method === 'POST'
          ? request.url
          : execParams(request.url, request.payload.params),
        {
          method: request.options && request.options.method ? request.options.method : 'POST',
          cache: 'no-cache',
          mode: 'cors',
          redirect: 'follow',
          referrer: 'no-referrer',
          body: request.options.method === 'POST' ? JSON.stringify(request.payload) : null,
          headers: {
            ...DEFAULT_HEADERS,
            ...(request.options && request.options.headers ? request.options.headers : {})
          }
        }
      ),
      request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT
    )
    return response
      .json()
      .then((body) => {
        return { result: body.result || body, req: request }
      })
      .then(handler)
  } catch (err) {
    throw err
  }
}
