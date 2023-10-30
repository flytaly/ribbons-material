import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import BaseSketch from './base-sketch';

export default class Sketch extends BaseSketch {
  constructor(selector) {
    super(selector, true);

    this.settings = {
      segments: 16,
      radSegments: 3,
      offset: 1.2,
    };

    this.addGui();
    this.addMaterial();
    this.addObjects();
    this.animate();
  }

  addGui() {
    super.addGui();
    this.gui.add(this.settings, 'radSegments', 3, 7, 1).onChange(() => {
      this.addObjects();
    });
    this.gui.add(this.settings, 'segments', 1, 40, 1).onChange((value) => {
      this.material.uniforms.u_segments.value = value;
    });
    this.gui.add(this.settings, 'offset', 0, 2, 0.1).onChange((value) => {
      this.material.uniforms.u_offset.value = value;
    });
  }

  addMaterial() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector4() },
        u_segments: { value: this.settings.segments },
        u_offset: { value: this.settings.offset },
      },
      /* wireframe: true, */
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: true,
      side: THREE.DoubleSide,
    });
  }

  addObjects() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    const geometry = new THREE.CylinderGeometry(1, 1, 5, this.settings.radSegments, 1, true);

    this.mesh = new THREE.Mesh(geometry, this.material);

    const rot = new THREE.Vector3(1, 0, -1);
    rot.normalize();
    this.mesh.rotateOnAxis(rot, Math.PI / 2);

    this.scene.add(this.mesh);

    /* const sphereGeo = new THREE.SphereGeometry(1, 32, 32); */
    /* this.scene.add(new THREE.Mesh(sphereGeo, this.material)); */
    /* this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(3, 3), this.material)); */
  }

  animate() {
    this.time += 0.05;

    this.material.uniforms.u_time.value = this.time;

    this.render();
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }
}

new Sketch('container');
