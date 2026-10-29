import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as THREE from 'three';
import { Product } from '../../models/product.model';
import { TPipe } from '../../pipes/t.pipe';
import { createSneakerMesh } from '../../three/sneaker-mesh';
import { StudioBundle, createStudio, resizeStudio } from '../../three/studio-scene';

@Component({
  selector: 'app-sneaker-stage-3d',
  standalone: true,
  imports: [CurrencyPipe, TPipe],
  templateUrl: './sneaker-stage-3d.html',
  styleUrl: './sneaker-stage-3d.scss',
})
export class SneakerStage3dComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() products: Product[] = [];
  @Output() selectProduct = new EventEmitter<Product>();
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  activeIndex = 0;
  private studio?: StudioBundle;
  private root?: THREE.Group;
  private shoe?: THREE.Group;
  private raf = 0;
  private disposed = false;
  private pointer = { x: 0, y: 0 };
  private auto = true;
  private spin = 0.35;
  private targetSpin = 0.35;
  private intro = 0;
  private transitioning = false;

  get active(): Product | null {
    return this.products[this.activeIndex] ?? null;
  }

  ngAfterViewInit() {
    this.studio = createStudio(this.host.nativeElement, { fov: 30, camY: 0.72, camZ: 4.35 });
    this.root = new THREE.Group();
    this.studio.scene.add(this.root);
    this.mountShoe(0, true);
    this.animate();
    window.addEventListener('resize', this.onResize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && this.studio && this.products.length) {
      this.activeIndex = Math.min(this.activeIndex, this.products.length - 1);
      this.mountShoe(this.activeIndex, true);
    }
  }

  ngOnDestroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.clearShoe();
    this.studio?.dispose();
  }

  next() {
    if (!this.products.length || this.transitioning) return;
    this.auto = false;
    this.goTo((this.activeIndex + 1) % this.products.length);
  }

  prev() {
    if (!this.products.length || this.transitioning) return;
    this.auto = false;
    this.goTo((this.activeIndex - 1 + this.products.length) % this.products.length);
  }

  open() {
    const p = this.active;
    if (p) this.selectProduct.emit(p);
  }

  onPointer(e: PointerEvent) {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }

  private goTo(index: number) {
    this.transitioning = true;
    const start = performance.now();
    const from = this.shoe;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 320);
      const ease = t * t * (3 - 2 * t);
      if (from) {
        from.scale.setScalar(1 - ease * 0.25);
        from.position.y = -ease * 0.25;
        this.setGroupOpacity(from, 1 - ease);
      }
      if (t < 1) {
        requestAnimationFrame(tick);
        return;
      }
      this.activeIndex = index;
      this.mountShoe(index, false);
      this.transitioning = false;
    };
    requestAnimationFrame(tick);
  }

  private mountShoe(index: number, instant: boolean) {
    if (!this.root || !this.products[index]) return;
    this.clearShoe();
    const p = this.products[index];
    this.shoe = createSneakerMesh(p.brand, p.colorway, p.slug);
    this.shoe.scale.setScalar(instant ? 1.35 : 1.05);
    this.shoe.position.y = instant ? 0.08 : 0.28;
    this.root.add(this.shoe);
    this.intro = instant ? 1 : 0;
    this.setGroupOpacity(this.shoe, instant ? 1 : 0);
  }

  private animate = () => {
    if (this.disposed || !this.studio || !this.root) return;
    this.raf = requestAnimationFrame(this.animate);

    if (this.auto) this.targetSpin += 0.0065;
    this.spin += (this.targetSpin + this.pointer.x * 0.45 - this.spin) * 0.06;

    if (this.intro < 1 && this.shoe) {
      this.intro = Math.min(1, this.intro + 0.045);
      const e = this.intro * this.intro * (3 - 2 * this.intro);
      this.shoe.scale.setScalar(1.05 + e * 0.3);
      this.shoe.position.y = 0.08 + 0.2 * (1 - e);
      this.setGroupOpacity(this.shoe, e);
    }

    if (this.shoe && this.intro >= 1) {
      this.shoe.rotation.y = this.spin;
      this.shoe.rotation.x = -0.12 + this.pointer.y * -0.12;
      this.shoe.position.y = 0.08 + Math.sin(performance.now() * 0.00115) * 0.028;
    }

    const cam = this.studio.camera;
    cam.position.x += (this.pointer.x * 0.35 - cam.position.x) * 0.05;
    cam.position.y += (0.72 + this.pointer.y * -0.2 - cam.position.y) * 0.05;
    cam.lookAt(0, 0.05, 0);

    this.studio.renderer.render(this.studio.scene, cam);
  };

  private setGroupOpacity(group: THREE.Object3D, opacity: number) {
    group.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach((mat) => {
        const phys = mat as THREE.MeshPhysicalMaterial;
        phys.transparent = opacity < 0.999;
        phys.opacity = opacity;
        phys.depthWrite = opacity > 0.9;
      });
    });
  }

  private clearShoe() {
    if (this.shoe) {
      this.root?.remove(this.shoe);
      this.disposeObject(this.shoe);
      this.shoe = undefined;
    }
  }

  private disposeObject(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => mat.dispose());
      }
    });
  }

  private onResize = () => {
    if (!this.studio) return;
    resizeStudio(this.studio.renderer, this.studio.camera, this.host.nativeElement);
  };
}
