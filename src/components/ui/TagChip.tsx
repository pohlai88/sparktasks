import { Chip } from './Badge';

interface TagChipProps {
  tag: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function TagChip({ tag, removable = false, onRemove, className = '' }: TagChipProps) {
  // Determine tag variant based on content patterns
  const getTagVariant = (tag: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag.includes('urgent') || lowerTag.includes('critical') || lowerTag.includes('emergency')) {
      return 'danger';
    }
    if (lowerTag.includes('important') || lowerTag.includes('priority') || lowerTag.includes('high')) {
      return 'warning';
    }
    if (lowerTag.includes('done') || lowerTag.includes('completed') || lowerTag.includes('finished')) {
      return 'success';
    }
    if (lowerTag.includes('review') || lowerTag.includes('meeting') || lowerTag.includes('call')) {
      return 'info';
    }
    if (lowerTag.includes('feature') || lowerTag.includes('enhancement') || lowerTag.includes('new')) {
      return 'primary';
    }
    
    return 'default';
  };

  const shouldShowRemove = Boolean(removable && onRemove);

  return (
    <Chip
      variant={getTagVariant(tag)}
      removable={shouldShowRemove}
      onRemove={shouldShowRemove ? onRemove! : undefined}
      className={className}
      size="sm"
    >
      #{tag}
    </Chip>
  );
}

interface TagListProps {
  tags: string[];
  removable?: boolean;
  onRemoveTag?: (tag: string) => void;
  maxVisible?: number;
  className?: string;
}

export function TagList({ 
  tags, 
  removable = false, 
  onRemoveTag, 
  maxVisible = 3,
  className = ''
}: TagListProps) {
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = Math.max(0, tags.length - maxVisible);

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {visibleTags.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          removable={removable}
          onRemove={onRemoveTag ? () => onRemoveTag(tag) : undefined}
        />
      ))}
      {hiddenCount > 0 && (
        <Chip variant="default" size="sm">
          +{hiddenCount} more
        </Chip>
      )}
    </div>
  );
}
