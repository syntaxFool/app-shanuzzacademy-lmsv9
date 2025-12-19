import { Handler } from '@netlify/functions'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyGxFUPk-kvRMd4-w7Gy-hOvUN72yAohXDS21CNdfuEQMPvq4hWPyRS3Jguydj5xjK3/exec'

export const handler: Handler = async (event) => {
  try {
    const method = event.httpMethod || 'POST'
    const queryParams = event.rawQuery || ''
    const url = `${GAS_URL}${queryParams ? '?' + queryParams : ''}`

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (method === 'POST' && event.body) {
      fetchOptions.body = event.body
    }

    const response = await fetch(url, fetchOptions)
    const data = await response.text()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: data
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy server error', details: String(error) })
    }
  }
}
