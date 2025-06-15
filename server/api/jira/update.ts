import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const domain = config.jiraDomain
  const email = config.jiraEmail
  const apiKey = config.jiraApiKey

  const { issueKey, fields, transitionId } = body

  const auth = Buffer.from(`${email}:${apiKey}`).toString('base64')
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  try {
    // Update fields if provided
    if (fields) {
      await axios.put(
        `https://${domain}/rest/api/3/issue/${issueKey}`,
        { fields },
        { headers }
      )
    }

    // Update status if transitionId is provided
    if (transitionId) {
      await axios.post(
        `https://${domain}/rest/api/3/issue/${issueKey}/transitions`,
        {
          transition: { id: transitionId }
        },
        { headers }
      )
    }

    return { success: true }
  } catch (err: any) {
    return { error: err.response?.data || err.message }
  }
})
