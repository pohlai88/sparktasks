import { parseQuickAdd } from '../src/domain/quickadd/parse';

const testDate = new Date('2025-08-15T10:00:00.000Z');
const result = parseQuickAdd('Task @due:next mon', testDate);
console.log('Result:', result);
console.log('Due date:', result.dueDate);

const result2 = parseQuickAdd('Task @due:in 2d', testDate);
console.log('Result2:', result2);
console.log('Due date2:', result2.dueDate);

const result3 = parseQuickAdd('Task @snooze:in 4h', testDate);
console.log('Result3:', result3);
console.log('Snooze:', result3.snoozeUntil);
