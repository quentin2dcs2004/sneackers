import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { createSneakerMesh } from '../../three/sneaker-mesh';
import { StudioBundle, createStudio, resizeStudio } from '../../three/studio-scene';

@Component({
  selector: 'app-shoe-viewer',
  standalone: true,
  templateUrl: './shoe-viewer.html',
  styleUrl: './shoe-viewer.scss',
})
export class ShoeViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() brand = '';
  @Input() name = '';
  @Input() colorway = '';
  @Input() slug = '';
  @Input() compact = false;
  @Input() imageUrl = '';
  @Input() imageUrlAlt?: string | null;

  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  private studio?: StudioBundle;
  private shoe?: THREE.Group;
  private raf = 0;
  private disposed = false;
  private dragging = false;
  private lastX = 0;
  private targetY = 0.45;
  private currentY = 0.45;
  private pointer = { x: 0, y: 0 };
  private auto = true;

  ngAfterViewInit() {
    this.studio = createStudio(this.host.nativeElement, { fov: 28, camY: 0.7, camZ: 4.1 });
    this.rebuild();
    this.animate();
    window.addEventListener('resize', this.onResize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['slug'] || changes['brand'] || changes['colorway']) && this.studio) {
      this.rebuild();
    }
  }

  ngOnDestroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.clearShoe();
    this.studio?.dispose();
  }

  onPointerDown(e: PointerEvent) {
    this.dragging = true;
    this.auto = false;
    this.lastX = e.clientX;
    this.host.nativeElement.setPointerCapture(e.pointerId);
  }

  onPointerUp(e: PointerEvent) {
    this.dragging = false;
    try {
      this.host.nativeElement.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  onPointerMove(e: PointerEvent) {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    if (!this.dragging) return;
    this.targetY += (e.clientX - this.lastX) * 0.01;
    this.lastX = e.clientX;
  }

  spin() {
    this.auto = true;
  }

  private rebuild() {
    if (!this.studio) return;
    this.clearShoe();
    this.shoe = createSneakerMesh(this.brand || 'ATELIER', this.colorway || 'Studio', this.slug || 'pair');
    this.shoe.scale.setScalar(1.28);
    this.studio.scene.add(this.shoe);
  }

  private animate = () => {
    if (this.disposed || !this.studio) return;
    this.raf = requestAnimationFrame(this.animate);

    if (this.auto) this.targetY += 0.008;
    this.currentY += (this.targetY - this.currentY) * 0.1;

    if (this.shoe) {
      this.shoe.rotation.y = this.currentY;
      this.shoe.rotation.x = -0.14 + this.pointer.y * -0.14;
      this.shoe.position.y = Math.sin(performance.now() * 0.0012) * 0.03;
    }

    const cam = this.studio.camera;
    cam.position.x += (this.pointer.x * 0.3 - cam.position.x) * 0.05;
    cam.position.y += (0.7 + this.pointer.y * -0.18 - cam.position.y) * 0.05;
    cam.lookAt(0, 0.05, 0);
    this.studio.renderer.render(this.studio.scene, cam);
  };

  private clearShoe() {
    if (!this.shoe) return;
    this.studio?.scene.remove(this.shoe);
    this.shoe.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => mat.dispose());
      }
    });
    this.shoe = undefined;
  }

  private onResize = () => {
    if (!this.studio) return;
    resizeStudio(this.studio.renderer, this.studio.camera, this.host.nativeElement);
  };
}
