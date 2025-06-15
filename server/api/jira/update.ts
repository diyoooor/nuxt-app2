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
    const { issueKey, fields, transitionId, comment } = await readBody(event)

    // update fields
    if (fields) {
      await axios.put(
        `https://${config.jiraDomain}/rest/api/3/issue/${issueKey}`,
        { fields },
        { headers }
      )
    }

    // transition status
    if (transitionId) {
      await axios.post(
        `https://${config.jiraDomain}/rest/api/3/issue/${issueKey}/transitions`,
        { transition: { id: transitionId } },
        { headers }
      )
    }

    // add comment
    if (comment) {
      await axios.post(
        `https://${config.jiraDomain}/rest/api/3/issue/${issueKey}/comment`,
        { body: comment },
        { headers }
      )
    }

    return { success: true }
  } catch (err: any) {
    return { error: err.response?.data || err.message }
  }
})
