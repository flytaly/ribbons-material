uniform float u_time;
uniform float u_segments;
uniform float u_offset;
uniform vec4 u_resolution;

varying vec2 vUv;

float line(float x, float offset, float width) {
  x -= fract(offset);
  if (abs(x) > width && abs(x - 1.0) > width && abs(x + 1.0) > width) {
    return 0.0;
  }
  return 1.0;
}

// https://iquilezles.org/articles/palettes/
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float num = u_segments;
  float width = 0.3;

  float id = floor(vUv.y * num);

  // if (id > num - 2.0 || id < 1.0) { // first and last
  //   width = 0.5;
  // }

  id /= num;
  // width -= id * 0.2;

  float offset = id * u_offset;
  offset += u_time * 0.05;

  float alpha = line(vUv.x, offset, width);

  if (alpha == 0.0) {
    discard;
  }

  float t = id + u_time * 0.03;
  vec3 color = vec3(id);
  color = palette(t, vec3(0.8, 0.5, 0.4), vec3(0.2, 0.4, 0.2), vec3(2.0, 1.0, 1.0), vec3(0.0, 0.25, 0.25));
  // color = palette(t, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.3, 0.2, 0.2));
  // color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.1, 0.2));

  if (!gl_FrontFacing) {
    color *= 0.5;
  }

  gl_FragColor = vec4(color, alpha);
}
