import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DESIGN_TOKENS } from '@/design/tokens';
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
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
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
        fullWidth ? DESIGN_TOKENS.sizing.target48 : '',
        className
      )}
    >
      {/* Select Trigger */}
      <button
        type='button'
        id={id}
        aria-label={ariaLabel}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-describedby={value ? `${id}-value` : undefined}
        className={cn(
          DESIGN_TOKENS.recipes.select,
          DESIGN_TOKENS.layout.patterns.spaceBetween +
            ` ${DESIGN_TOKENS.sizing.full}`,
          isOpen && DESIGN_TOKENS.layout.focus.ringBlue,
          disabled && DESIGN_TOKENS.layout.patterns.disabled
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span
          className={cn(
            DESIGN_TOKENS.typography.inline.truncate1,
            !selectedOption && DESIGN_TOKENS.theme.light.ink.disabled
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={cn(
            DESIGN_TOKENS.icons.button,
            '${DESIGN_TOKENS.spacing.iconLeft} flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden='true'
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul
          ref={listRef}
          role='listbox'
          aria-labelledby={id}
          className={cn(
            DESIGN_TOKENS.layout.patterns.selectDropdown,
            DESIGN_TOKENS.recipes.menu,
            DESIGN_TOKENS.layout.patterns.scrollableMenu
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role='option'
              aria-selected={option.value === value}
              className={cn(
                DESIGN_TOKENS.recipes.selectOption,
                option.value === value &&
                  DESIGN_TOKENS.colors.status.active.bg +
                    ' ' +
                    DESIGN_TOKENS.colors.status.active.text,
                index === focusedIndex &&
                  DESIGN_TOKENS.colors.states.default.hover,
                option.disabled && DESIGN_TOKENS.colors.states.disabled.text,
                !option.disabled && DESIGN_TOKENS.interaction.menu
              )}
              onClick={() => handleOptionClick(option)}
            >
              {/* Checkmark for selected option */}
              {option.value === value && (
                <span className={DESIGN_TOKENS.recipes.selectCheckmark}>
                  <Check
                    className={DESIGN_TOKENS.icons.sizes.sm}
                    aria-hidden='true'
                  />
                </span>
              )}

              {/* Option label */}
              <span
                className={cn(
                  'block truncate',
                  option.value === value ? 'font-medium' : 'font-normal'
                )}
              >
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

  const displayText =
    selectedLabels.length === 0
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
        label: values.includes(opt.value) ? `✓ ${opt.label}` : opt.label,
      }))}
    />
  );
}

