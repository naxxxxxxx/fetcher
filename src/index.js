import Fetch from './fetch'

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Fetch === 'undefined') {
  window.Fetch = Fetch
}

export default Fetch
