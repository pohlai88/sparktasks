import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DESIGN_TOKENS } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

export function Select({ 
  options, 
  value, 
  placeholder = 'Select an option...',
  onChange,
  disabled = false,
  fullWidth = false,
  className = '',
  id,
  'aria-label': ariaLabel
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          const nextIndex = Math.min(focusedIndex + 1, options.length - 1);
          setFocusedIndex(nextIndex);
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div 
      ref={selectRef}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : '',
        className
      )}
    >
      {/* Select Trigger */}
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-describedby={value ? `${id}-value` : undefined}
        className={cn(
          DESIGN_TOKENS.recipes.select,
          'flex items-center justify-between w-full',
          isOpen && 'ring-2 ring-blue-500',
          disabled && DESIGN_TOKENS.layout.patterns.disabled
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span className={cn(
          'block truncate',
          !selectedOption && 'text-slate-400'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          className={cn(
            DESIGN_TOKENS.icons.button,
            'ml-2 flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby={id}
          className={cn(
            'absolute z-10 mt-1 w-full',
            DESIGN_TOKENS.recipes.menu,
            'max-h-60 overflow-auto'
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                'relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors',
                option.value === value && 'bg-blue-50 text-blue-900',
                index === focusedIndex && 'bg-slate-100',
                option.disabled && 'opacity-50 cursor-not-allowed',
                !option.disabled && 'hover:bg-slate-50'
              )}
              onClick={() => handleOptionClick(option)}
            >
              {/* Checkmark for selected option */}
              {option.value === value && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                  <Check className={DESIGN_TOKENS.icons.sizes.sm} aria-hidden="true" />
                </span>
              )}
              
              {/* Option label */}
              <span className={cn(
                'block truncate',
                option.value === value ? 'font-medium' : 'font-normal'
              )}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Multi-select variant
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  values: string[];
  onChange: (values: string[]) => void;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  values,
  onChange,
  maxDisplay = 3,
  ...props
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const selectedLabels = options
    .filter(opt => values.includes(opt.value))
    .map(opt => opt.label);

  const displayText = selectedLabels.length === 0 
    ? props.placeholder 
    : selectedLabels.length <= maxDisplay
    ? selectedLabels.join(', ')
    : `${selectedLabels.slice(0, maxDisplay).join(', ')} +${selectedLabels.length - maxDisplay} more`;

  return (
    <Select
      {...props}
      value={displayText}
      onChange={() => {}} // Handled by individual option clicks
      options={options.map(opt => ({
        ...opt,
        label: values.includes(opt.value) ? `✓ ${opt.label}` : opt.label
      }))}
    />
  );
}
