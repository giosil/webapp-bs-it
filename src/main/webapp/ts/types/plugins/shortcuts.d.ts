/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */

declare interface ShortcutsOptions {
    type?: string,
    propagate?: boolean,
    disable_in_input?: boolean,
    target?: Element,
    keycode?: boolean
}

declare interface Shortcut {
    all_shortcuts: object,
    add: (shortcut_combination: string, callback: () => void, opt?: ShortcutsOptions) => void,
    remove: (shortcut_combination: string) => void
}

declare function _confirm(msg: string, f?: (response: any) => void);

declare var shortcut: Shortcut;