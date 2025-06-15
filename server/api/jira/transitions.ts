import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { issueKey } = getQuery(event)

  const auth = Buffer.from(`${config.jiraEmail}:${config.jiraToken}`).toString('base64')
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
  }

  try {
    const response = await axios.get(
      `https://${config.jiraDomain}/rest/api/3/issue/${issueKey}/transitions`,
      { headers }
    )

    return response.data
  } catch (err: any) {
    return { error: err.response?.data || err.message }
  }
})
