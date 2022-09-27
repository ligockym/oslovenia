// from https://svelte.dev/repl/de39de663ef2445b8fe17b79c500013b?version=3.50.1
import {derived, get, writable} from "svelte/store";
import translations from "./translation";

export const locale = writable("sk");
export const locales = Object.keys(translations);

function translate(locale, key, vars): string {
    // Let's throw some errors if we're trying to use keys/locales that don't exist.
    // We could improve this by using Typescript and/or fallback values.
    if (!key) throw new Error("no key provided to $t()");
    if (!locale) throw new Error(`no translation for key "${key}"`);

    // Grab the translation from the translations object.
    let text = translations[locale][key];

    if (!text) throw new Error(`no translation found for ${locale}.${key}`);

    // Replace any passed in variables in the translation string.
    Object.keys(vars).map((k) => {
        const regex = new RegExp(`{{${k}}}`, "g");
        text = text.replace(regex, vars[k]);
    });

    return text;
}

// does not mutate, do not use in components
export function toff(key: string, vars = {}): string {
    return translate(get(locale), key, vars);
}

// does mutate when language changes, use in components
export const t = derived(locale, ($locale) => (key, vars = {}) =>
    translate($locale, key, vars)
);
