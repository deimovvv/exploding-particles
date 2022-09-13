uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture1;
float PI = 3.1415926535897932
void main(){
    vUv = uv;
    vec4 mvposition = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = 1. * (1. / - mvposition.z);
    gl_Position = projectionMatrix * mvposition;
}


