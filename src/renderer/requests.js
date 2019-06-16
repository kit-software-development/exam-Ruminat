const server = 'http://192.168.124.128:8000/'

async function GET (url) {
  const rawResponse = await fetch(`${server}${url}`, {method: 'GET'})
  console.log('GET', url)
  const result = await rawResponse.json()
  return result
}

async function POST (url, data) {
  const rawResponse = await fetch(`${server}${url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  console.log(JSON.stringify(data))
  const result = await rawResponse.json()
  return result
}

export default {
  async register ({username, email, password}) {
    const result = await POST('register/', {username, email, password})
    return result
  },
  async login ({username, password}) {
    const result = await POST('auth_user/', {username, password})
    return result
  },
  async syncTest (username, cards) {
    const result = await POST('api/sync-test/', {username, cards: cards || []})
    return result
  },
  async sendCards (username, cards) {
    const result = await POST('add_card/', {username, cards})
    return result
  },
  async deleteCard (username, ID) {
    const result = await POST('delete_card/', {username, ID})
    return result
  },
  async getPublic () {
    const result = await GET('get_public/')
    return result
  }
}
