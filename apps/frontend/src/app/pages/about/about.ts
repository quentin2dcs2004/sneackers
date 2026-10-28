import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutPage {}
