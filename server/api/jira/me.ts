import { defineEventHandler } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const status = query.status as string | undefined


  const domain = config.jiraDomain
  const email = config.jiraEmail
  const apiKey = config.jiraApiKey

  const auth = Buffer.from(`${email}:${apiKey}`).toString('base64')
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: 'application/json',
  }

  let jql = 'assignee=currentUser()'
  if (status && status !== 'All') {
    jql += ` AND status="${status}"`
  }
  jql += ' ORDER BY created DESC'

  try {
    const response = await axios.get(`https://${domain}/rest/api/3/search`, {
      headers,
      params: {
        jql,
        maxResults: 1000,
        fields: 'summary,status,priority,created'
      }
    })

    const issues = response.data.issues

    const statusCounts: Record<string, number> = {}
    
    for (const issue of issues) {
      const s = issue.fields.status.name
      statusCounts[s] = (statusCounts[s] || 0) + 1
    }

    return {
      issues,
      statusCounts
    }
  } catch (err: any) {
    return { error: err.response?.data || err.message }
  }
})
