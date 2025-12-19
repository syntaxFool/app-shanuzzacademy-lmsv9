import { Handler } from '@netlify/functions'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyGxFUPk-kvRMd4-w7Gy-hOvUN72yAohXDS21CNdfuEQMPvq4hWPyRS3Jguydj5xjK3/exec'

export const handler: Handler = async (event) => {
  try {
    const queryParams = new URLSearchParams(event.rawQuery || '').toString()
    const url = `${GAS_URL}${queryParams ? '?' + queryParams : ''}`
    
    // Forward GET request to Google Apps Script
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.text()
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: data
    }
  } catch (error) {
    console.error('Sync function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    }
  }
}
