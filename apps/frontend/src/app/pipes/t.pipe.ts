import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationKey } from '../i18n/translations';
import { I18nService } from '../services/i18n.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: TranslationKey): string {
    // touch lang signal so impure pipe refreshes
    this.i18n.lang();
    return this.i18n.t(key);
  }
}
