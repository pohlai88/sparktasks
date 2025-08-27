/**
 * CommandSystem - Universal Command System Components
 *
 * Export all command system components with proper MAPS v3.0 integration
 */

export { CommandPalette, DefaultCommandCategories } from './CommandPalette';
export {
  CommandRegistry,
  useCommandRegistry,
  AutomaticCommands,
} from './CommandRegistry';

export type {
  Command,
  CommandGroup,
  CommandPaletteProps,
} from './CommandPalette';

export type {
  CommandContext,
  CommandFilter,
  CommandRegistryConfig,
  CommandRegistryProps,
  UseCommandRegistryReturn,
} from './CommandRegistry';
