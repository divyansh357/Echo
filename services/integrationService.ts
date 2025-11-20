
import { InboxItem, SourceType, UserCredentials } from '../types';
import { MOCK_INBOX } from '../constants';

/**
 * Fetches data from all configured sources.
 * Returns an object with successfully fetched items and a list of error messages for diagnostics.
 */
export const fetchIntegrationsData = async (credentials: UserCredentials): Promise<{ items: InboxItem[], errors: string[] }> => {
  const items: InboxItem[] = [];
  const errors: string[] = [];

  // --- 1. Gmail & Calendar ---
  if (credentials.googleToken) {
    // Gmail
    try {
      const gmailItems = await fetchGmail(credentials.googleToken);
      items.push(...gmailItems);
    } catch (e: any) {
      const msg = e.message || "Unknown Error";
      console.warn("Gmail fetch failed, switching to simulation:", msg);
      errors.push(`Gmail: ${msg}`);
      // Fallback to Mock Email only on error
      const mockEmails = MOCK_INBOX.filter(i => i.source === SourceType.EMAIL);
      items.push(...mockEmails);
    }

    // Calendar
    try {
      const calendarItems = await fetchCalendar(credentials.googleToken);
      if (calendarItems.length === 0) {
          // If calendar is empty, show mocks to make the schedule look interesting
          const mockCalendar = MOCK_INBOX.filter(i => i.source === SourceType.CALENDAR);
          items.push(...mockCalendar);
      } else {
          items.push(...calendarItems);
      }
    } catch (e: any) {
      const msg = e.message || "Unknown Error";
      console.warn("Calendar fetch failed, switching to simulation:", msg);
      errors.push(`Calendar: ${msg}`);
      const mockCalendar = MOCK_INBOX.filter(i => i.source === SourceType.CALENDAR);
      items.push(...mockCalendar);
    }
  }

  // --- 2. Slack (Always populated) ---
  let slackItems: InboxItem[] = [];
  let slackFetchAttempted = false;

  if (credentials.slackToken) {
    slackFetchAttempted = true;
    try {
      slackItems = await fetchSlack(credentials.slackToken);
    } catch (e: any) {
      const msg = e.message || "Unknown Error";
      console.warn("Slack fetch failed, switching to simulation:", msg);
      errors.push(`Slack: ${msg}`);
    }
  }

  // Inject mocks if:
  // 1. No token provided (User wants to see demo data for this section)
  // 2. Fetch failed (slackItems is empty after try/catch)
  // 3. Fetch succeeded but returned 0 items (User has empty Slack, but we want to show demo)
  if (slackItems.length === 0) {
    const mockSlack = MOCK_INBOX.filter(i => i.source === SourceType.SLACK);
    items.push(...mockSlack);
  } else {
    items.push(...slackItems);
  }

  // --- 3. Jira (Always populated) ---
  let jiraItems: InboxItem[] = [];
  let jiraFetchAttempted = false;

  if (credentials.jira && credentials.jira.apiToken) {
    jiraFetchAttempted = true;
    try {
      jiraItems = await fetchJira(credentials.jira);
    } catch (e: any) {
      const msg = e.message || "Unknown Error";
      console.warn("Jira fetch failed, switching to simulation:", msg);
      errors.push(`Jira: ${msg}`);
    }
  }

  // Inject mocks if no token, error, or empty result
  if (jiraItems.length === 0) {
    const mockJira = MOCK_INBOX.filter(i => i.source === SourceType.JIRA);
    items.push(...mockJira);
  } else {
    items.push(...jiraItems);
  }

  return { items, errors };
};

// --- Helper Functions ---

async function fetchGmail(token: string): Promise<InboxItem[]> {
  // Fetch list of message IDs
  const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!listRes.ok) {
    const errText = await listRes.text().catch(() => listRes.statusText);
    let cleanErr = errText;
    try {
        const jsonErr = JSON.parse(errText);
        cleanErr = jsonErr.error?.message || errText;
    } catch {}
    throw new Error(`API Request Failed (${listRes.status}): ${cleanErr}`);
  }
  
  const listData = await listRes.json();
  if (!listData.messages) return [];

  // Fetch details for each message
  const promises = listData.messages.map(async (msg: any) => {
    const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!detailRes.ok) return null;
    const data = await detailRes.json();
    
    const headers = data.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
    const sender = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
    
    return {
      id: `gmail-${data.id}`,
      source: SourceType.EMAIL,
      sender: sender,
      subject: subject,
      content: data.snippet, // Gmail provides a snippet preview
      timestamp: new Date(parseInt(data.internalDate)).toISOString(),
      read: !data.labelIds.includes('UNREAD')
    } as InboxItem;
  });

  const results = await Promise.all(promises);
  return results.filter(item => item !== null) as InboxItem[];
}

async function fetchCalendar(token: string): Promise<InboxItem[]> {
  const now = encodeURIComponent(new Date().toISOString());
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=5&singleEvents=true&orderBy=startTime`, {
     headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    let cleanErr = errText;
    try {
        const jsonErr = JSON.parse(errText);
        cleanErr = jsonErr.error?.message || errText;
    } catch {}
    throw new Error(`API Request Failed (${res.status}): ${cleanErr}`);
  }

  const data = await res.json();

  return (data.items || []).map((event: any) => ({
    id: `cal-${event.id}`,
    source: SourceType.CALENDAR,
    sender: event.organizer?.email || 'Calendar',
    subject: event.summary || 'No Title',
    content: event.description || `Event at ${new Date(event.start.dateTime || event.start.date).toLocaleTimeString()}`,
    timestamp: event.start.dateTime || event.start.date || new Date().toISOString(),
    read: false
  }));
}

async function fetchSlack(token: string): Promise<InboxItem[]> {
  // 1. First, list public channels to find one to read from
  const listRes = await fetch('https://slack.com/api/conversations.list?limit=5&types=public_channel', { 
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!listRes.ok) {
     throw new Error(`Network Error during Channel List (${listRes.status})`);
  }

  const listData = await listRes.json();
  if (!listData.ok) throw new Error(`Slack Channel List Error: ${listData.error}`);

  const channels = listData.channels;
  if (!channels || channels.length === 0) {
      throw new Error("No public channels found in this Slack workspace.");
  }

  // 2. Pick the first channel
  const channelId = channels[0].id;
  
  // 3. Fetch History
  const historyRes = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=10`, { 
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!historyRes.ok) {
     throw new Error(`Network Error during History Fetch (${historyRes.status})`);
  }
  
  const historyData = await historyRes.json();
  if (!historyData.ok) throw new Error(`Slack History Error: ${historyData.error}`);

  return historyData.messages.map((msg: any) => ({
    id: `slack-${msg.ts}`,
    source: SourceType.SLACK,
    sender: msg.user || 'Slack User',
    subject: `Message in #${channels[0].name}`,
    content: msg.text,
    timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
    read: false
  }));
}

async function fetchJira(creds: { domain: string; email: string; apiToken: string }): Promise<InboxItem[]> {
  const auth = btoa(`${creds.email}:${creds.apiToken}`);
  
  const res = await fetch(`https://${creds.domain}/rest/api/3/search?jql=assignee=currentUser() AND resolution=Unresolved&maxResults=5`, {
    headers: { 
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Status ${res.status} - Likely CORS or Auth block`);
  }
  const data = await res.json();

  return (data.issues || []).map((issue: any) => ({
    id: `jira-${issue.id}`,
    source: SourceType.JIRA,
    sender: issue.fields.reporter?.displayName || 'Jira',
    subject: issue.key,
    content: issue.fields.summary,
    timestamp: issue.fields.created,
    read: false
  }));
}
