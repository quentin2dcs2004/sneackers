import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../../pipes/t.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {}
