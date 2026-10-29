import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import { Product } from '../../models/product.model';
import { TPipe } from '../../pipes/t.pipe';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [RouterLink, RevealDirective, TPipe],
  templateUrl: './lookbook.html',
  styleUrl: './lookbook.scss',
})
export class LookbookPage implements OnInit {
  private readonly api = inject(ApiService);
  readonly items = signal<Product[]>([]);

  ngOnInit() {
    this.api.getFeatured().subscribe((items) => this.items.set(items));
  }
}
