# Storage Contracts and Patterns

This document defines the storage layer contracts and patterns used across SparkTasks.

## Storage Driver Interface

### Basic Operations
```typescript
interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  listKeys(prefix: string): Promise<string[]>;
  
  // Optional atomic operations capability
  atomic?: {
    // Atomically write multiple key-value pairs
    setItems?(items: Array<{ key: string; value: string }>): Promise<void>;
    
    // Advertise atomicity capability
    capability: 'transaction' | 'temp-swap' | 'none';
  };
}
```

### Atomic Operations

Storage drivers can implement different levels of atomicity:

- **`transaction`**: True ACID transactions (e.g., IndexedDB transactions)
- **`temp-swap`**: Atomic operations using temporary keys + swap pattern  
- **`none`**: No atomicity guarantees beyond single operations

## RemoteAdapter Metadata Contract

### Per-Key Metadata Format (v1)

Each stored key has associated metadata stored at `namespace:__meta__:key`:

```json
{
  "version": 1,
  "updatedAt": "2025-08-15T16:30:00.000Z",
  "source": "local"
}
```

### Metadata Versioning

- **Version 0** (legacy): Raw ISO timestamp string
- **Version 1** (current): Structured metadata with versioning support

### Namespace Conventions

- **Data keys**: `namespace:key`
- **Metadata keys**: `namespace:__meta__:key`  
- **Temporary keys**: `namespace:key__tmp__timestamp`

Temporary keys are automatically cleaned up on startup and excluded from listings.

### Last-Write-Wins (LWW) Resolution

Conflict resolution follows these rules:

1. **No local version**: Apply remote
2. **Legacy local (no metadata)**: Create metadata, apply remote if content differs
3. **Both have metadata**: Apply remote only if `remoteTime > localTime` (strict)

Remote wins on exact timestamp ties are avoided to prevent sync ping-pong.

## Atomic Write Patterns

### RemoteAdapter Value+Metadata Writes

RemoteAdapter ensures atomic writes of value and metadata:

```typescript
// Preferred: True transactions if supported
if (driver.atomic?.capability === 'transaction') {
  await driver.atomic.setItems([
    { key: dataKey, value: data },
    { key: metaKey, value: metadata }
  ]);
}

// Fallback: Temp-swap pattern
else {
  const tempData = `${dataKey}__tmp__${timestamp}`;
  const tempMeta = `${metaKey}__tmp__${timestamp}`;
  
  try {
    await driver.setItem(tempData, data);
    await driver.setItem(tempMeta, metadata);
    await driver.setItem(dataKey, data);
    await driver.setItem(metaKey, metadata);
    await driver.removeItem(tempData);
    await driver.removeItem(tempMeta);
  } catch (error) {
    // Cleanup temps on failure
    await cleanup(tempData, tempMeta);
    throw error;
  }
}
```

### Eventlog Atomic Appends

Event log maintains append-only semantics with atomic writes:

```typescript
try {
  driver.setItem(TEMP_KEY, newEventLog);
  driver.setItem(PRIMARY_KEY, newEventLog);
  driver.removeItem(TEMP_KEY);
} catch (error) {
  driver.removeItem(TEMP_KEY); // Cleanup
  throw error;
}
```

## Migration and Compatibility

### Legacy Key Migration

When encountering keys without metadata during sync:

1. Create metadata with current timestamp
2. Use content comparison for conflict resolution
3. Conservative approach: apply remote if content differs

### Startup Cleanup

On initialization, RemoteAdapter cleans up orphaned temporary keys:

```typescript
const tempKeys = await driver.listKeys(namespace)
  .filter(key => key.includes('__tmp__'));
  
for (const tempKey of tempKeys) {
  await driver.removeItem(tempKey);
}
```

## Implementation Notes

### Clock Strategy

- **Local timestamps**: Client-generated ISO strings
- **Remote timestamps**: Server-provided when available
- **Skew tolerance**: Use `getTime()` for millisecond precision comparisons

### Privacy Considerations

- Metadata timestamps reveal change patterns even under E2EE
- Consider this acceptable for the threat model or implement timestamp obfuscation

### Performance

- Metadata adds ~2x write operations per key
- Atomic operations may increase latency on some backends
- Temporary key cleanup is non-blocking and failure-tolerant

## Testing Strategy

### Fault Injection

Test atomic operations with simulated failures:

- Power loss between temp write and primary write
- Network failures during remote sync
- Storage quota exceeded during temp operations

### Migration Testing

- Legacy keys without metadata
- Mixed version metadata in same dataset
- Clock skew scenarios with overlapping timestamps

## Error Handling

### Write Failures

- Always cleanup temporary keys on failure
- Preserve existing data on atomic operation failure
- Throw original errors after cleanup attempts

### Read Failures

- Treat missing metadata as legacy format
- Graceful degradation for corrupted metadata
- Default to conservative conflict resolution
