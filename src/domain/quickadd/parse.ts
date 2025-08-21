import { type QuickAddResult, QuickAddResultSchema } from './schema';

const PRIORITY_REGEX = /!p([012])/gi;
const STATUS_REGEX = /@status:(today|later|done)/gi;
const TAG_REGEX = /#([A-Za-z0-9_-]+)/g;
const DUE_REGEX = /@due:([^@#!\s]+(?:\s+[^@#!\s]+)*)/gi;
const SNOOZE_REGEX = /@snooze:([^@#!\s]+(?:\s+[^@#!\s]+)*)/gi;
const BARE_KEYWORD_REGEX = /(?<![#@!])\b(today|tomorrow)\b/gi;

export function parseQuickAdd(input: string, now = new Date()): QuickAddResult {
  let text = input.trim().replaceAll(/\s+/g, ' ');

  // Extract priority
  let priority: 'P0' | 'P1' | 'P2' = 'P1';
  text = text.replaceAll(PRIORITY_REGEX, (_, level) => {
    priority = `P${level}` as 'P0' | 'P1' | 'P2';
    return '';
  });

  // Extract status
  let status: 'TODAY' | 'LATER' | 'DONE' = 'TODAY';
  text = text.replaceAll(STATUS_REGEX, (_, statusValue) => {
    status = statusValue.toUpperCase() as 'TODAY' | 'LATER' | 'DONE';
    return '';
  });

  // Extract tags
  const tags: string[] = [];
  text = text.replaceAll(TAG_REGEX, (_, tag) => {
    tags.push(tag);
    return '';
  });

  // Extract due date
  let dueDate: string | undefined;
  text = text.replaceAll(DUE_REGEX, (_, dateToken) => {
    try {
      dueDate = resolveDateToken(dateToken, now);
    } catch (error) {
      // If date resolution fails, keep as-is in text
      return _;
    }
    return '';
  });

  // Extract snooze
  let snoozeUntil: string | undefined;
  text = text.replaceAll(SNOOZE_REGEX, (_, dateToken) => {
    try {
      snoozeUntil = resolveDateToken(dateToken, now, true);
    } catch (error) {
      // If date resolution fails, keep as-is in text
      return _;
    }
    return '';
  });

  // Handle bare keywords (today/tomorrow) as due dates if not already set
  if (!dueDate) {
    text = text.replaceAll(BARE_KEYWORD_REGEX, match => {
      dueDate = resolveDateToken(match, now);
      return '';
    });
  }

  // Clean up remaining whitespace
  const title = text.replaceAll(/\s+/g, ' ').trim();

  const result = QuickAddResultSchema.parse({
    title,
    priority,
    status,
    tags,
    dueDate,
    snoozeUntil,
  });

  return result;
}

function resolveDateToken(
  token: string,
  now: Date,
  allowHours = false
): string {
  const lowerToken = token.toLowerCase();

  // Handle 'today'
  if (lowerToken === 'today') {
    return now.toISOString();
  }

  // Handle 'tomorrow'
  if (lowerToken === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  // Handle ISO dates (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(token)) {
    const date = new Date(`${token}T${now.toISOString().slice(11)}`);
    return date.toISOString();
  }

  // Handle 'next weekday'
  const nextWeekdayMatch = lowerToken.match(
    /^next\s+(mon|tue|wed|thu|fri|sat|sun)$/
  );
  if (nextWeekdayMatch) {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const targetDay = weekdays.indexOf(nextWeekdayMatch[1]);
    const currentDay = now.getDay();

    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Next occurrence
    }

    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate.toISOString();
  }

  // Handle 'in Nd' (days)
  const daysMatch = lowerToken.match(/^in\s+(\d+)d$/);
  if (daysMatch) {
    const days = Number.parseInt(daysMatch[1], 10);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString();
  }

  // Handle 'in Nw' (weeks)
  const weeksMatch = lowerToken.match(/^in\s+(\d+)w$/);
  if (weeksMatch) {
    const weeks = Number.parseInt(weeksMatch[1], 10);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + weeks * 7);
    return futureDate.toISOString();
  }

  // Handle 'in Nh' (hours) - only for snooze
  if (allowHours) {
    const hoursMatch = lowerToken.match(/^in\s+(\d+)h$/);
    if (hoursMatch) {
      const hours = Number.parseInt(hoursMatch[1], 10);
      const futureDate = new Date(now);
      futureDate.setHours(futureDate.getHours() + hours);
      return futureDate.toISOString();
    }
  }

  // If no pattern matches, return as-is (will likely cause validation error)
  return token;
}
