import { Injectable, computed, effect, signal } from '@angular/core';
import { Lang, TRANSLATIONS, TranslationKey } from '../i18n/translations';

const LANG_KEY = 'sa_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly langSignal = signal<Lang>(this.read());

  readonly lang = this.langSignal.asReadonly();
  readonly isFr = computed(() => this.langSignal() === 'fr');

  constructor() {
    effect(() => {
      const lang = this.langSignal();
      document.documentElement.lang = lang;
      localStorage.setItem(LANG_KEY, lang);
    });
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.langSignal()][key] ?? TRANSLATIONS.fr[key] ?? key;
  }

  setLang(lang: Lang) {
    this.langSignal.set(lang);
  }

  toggle() {
    this.langSignal.set(this.langSignal() === 'fr' ? 'en' : 'fr');
  }

  private read(): Lang {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'en' || saved === 'fr' ? saved : 'fr';
  }
}
