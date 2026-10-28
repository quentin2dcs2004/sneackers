import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import * as THREE from 'three';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-slider-3d',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-slider-3d.html',
  styleUrl: './product-slider-3d.scss',
})
export class ProductSlider3dComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() products: Product[] = [];
  @ViewChild('canvasHost', { static: true }) canvasHost!: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);
  activeIndex = 0;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private group?: THREE.Group;
  private meshes: THREE.Mesh[] = [];
  private textures: THREE.Texture[] = [];
  private raf = 0;
  private disposed = false;
  private pointerX = 0;
  private targetRot = 0;
  private currentRot = 0;

  ngAfterViewInit() {
    this.initThree();
    this.rebuild();
    this.animate();
    window.addEventListener('resize', this.onResize);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && this.scene) {
      this.rebuild();
    }
  }

  ngOnDestroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.textures.forEach((t) => t.dispose());
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    this.renderer?.dispose();
  }

  get active(): Product | null {
    return this.products[this.activeIndex] ?? null;
  }

  next() {
    if (!this.products.length) return;
    this.activeIndex = (this.activeIndex + 1) % this.products.length;
    this.targetRot -= (Math.PI * 2) / Math.max(this.products.length, 1);
  }

  prev() {
    if (!this.products.length) return;
    this.activeIndex = (this.activeIndex - 1 + this.products.length) % this.products.length;
    this.targetRot += (Math.PI * 2) / Math.max(this.products.length, 1);
  }

  openActive() {
    const p = this.active;
    if (p) this.router.navigate(['/shop', p.slug]);
  }

  onPointerMove(e: PointerEvent) {
    const rect = this.canvasHost.nativeElement.getBoundingClientRect();
    this.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  }

  private initThree() {
    const host = this.canvasHost.nativeElement;
    const width = host.clientWidth || 640;
    const height = host.clientHeight || 420;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.15, 5.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    host.appendChild(this.renderer.domElement);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(2, 3, 4);
    this.scene.add(ambient, key);
  }

  private rebuild() {
    if (!this.group || !this.scene) return;

    this.meshes.forEach((m) => {
      this.group!.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    this.textures.forEach((t) => t.dispose());
    this.meshes = [];
    this.textures = [];

    const loader = new THREE.TextureLoader();
    const count = this.products.length || 1;
    const radius = 2.35;

    this.products.forEach((product, i) => {
      const tex = loader.load(product.imageUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      this.textures.push(tex);

      const geo = new THREE.PlaneGeometry(1.7, 2.15, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / count) * Math.PI * 2;
      mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      mesh.lookAt(0, 0, 0);
      mesh.userData['index'] = i;
      this.group!.add(mesh);
      this.meshes.push(mesh);
    });

    this.activeIndex = 0;
    this.targetRot = 0;
    this.currentRot = 0;
  }

  private animate = () => {
    if (this.disposed || !this.renderer || !this.scene || !this.camera || !this.group) return;
    this.raf = requestAnimationFrame(this.animate);

    this.currentRot += (this.targetRot - this.currentRot) * 0.08;
    this.group.rotation.y = this.currentRot + this.pointerX * 0.12;
    this.group.rotation.x = this.pointerX * 0.02;

    const t = performance.now() * 0.001;
    this.meshes.forEach((mesh, i) => {
      const pos = mesh.geometry.attributes['position'] as THREE.BufferAttribute;
      for (let v = 0; v < pos.count; v++) {
        const x = pos.getX(v);
        const y = pos.getY(v);
        const wave = Math.sin(x * 2.2 + t + i) * 0.03 + Math.cos(y * 2.5 + t * 1.2) * 0.02;
        pos.setZ(v, wave);
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    });

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    if (!this.renderer || !this.camera) return;
    const host = this.canvasHost.nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}
