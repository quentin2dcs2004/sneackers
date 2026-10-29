import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TPipe } from '../../pipes/t.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, TPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {}
