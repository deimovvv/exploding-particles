uniform float time;
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform float progress;

varying vec3 vPosition;
varying float pulse;
varying vec2 vUv;
varying vec3 vNormal;





void main() {
    // gl_FragColor = vec4(0.,0.,1., 1.);

   /* vec2 newUv = vPosition.xy/vec2(480.,820.) + vec2(0.5); */ 
    vec4 texture0 = texture2D(uTexture,vUv);
    vec4 texture1 = texture2D(uTexture1,vUv);


    vec4 finalTexture = mix(texture0, texture1,progress);

    vec4 myimage = texture(
        uTexture,
        vUv 
    );

    gl_FragColor = vec4( vUv,0.,1.);

    gl_FragColor = myimage;
    if(gl_FragColor.r<0.1 && gl_FragColor.g<0.1 && gl_FragColor.b<0.1) discard;


    
}