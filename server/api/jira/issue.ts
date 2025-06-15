import { defineEventHandler } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const domain = config.jiraDomain 
  const email = config.jiraEmail
  const apiKey = config.jiraApiKey
  const issueKey = 'VECOM-3941'

  console.log({domain, email, apiKey, issueKey})

  const auth = Buffer.from(`${email}:${apiKey}`).toString('base64')

  try {
    const response = await axios.get(`https://${domain}/rest/api/3/issue/${issueKey}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    console.log(error)
    return { error: error.response?.data || error.message }
  }
})
