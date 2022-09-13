import * as THREE from 'three';
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import vertexParticle from './shaders/vertexParticle.glsl'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'


import testTexture from '../static/end.png';
import testTexture1 from '../static/end.png';

import gsap from 'gsap'
import dat from 'dat-gui'



export default class Sketch{
    constructor(options){
        this.scene = new THREE.Scene();

        this.container = options.domElement;
        this.width=this.container.offsetWidth;
        this.height=this.container.offsetHeight;
       

        this.renderer = new THREE.WebGLRenderer( { 
            antialias: true,
           alpha: true
         } );
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        /* this.renderer.outputEncoding = THREE.sRGBEncoding */
        this.renderer.setClearColor(0x000000, 1)
        this.renderer.setPixelRatio(Math.min(devicePixelRatio),2);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 0.01, 2000 );
        this.camera.position.z = 1000;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true

        
        this.time = 0;

        this.video = document.getElementById('video1')
        this.video.addEventListener('ended', ()=> {
            gsap.to(this.video, {
                duration: 0.1,
                opacity: 0
            })

            gsap.to(this.bloompass, {
                duration: 2,
                strength: 6,
                delay: 0.5,
                ease: "power2.in"
               
            }),

            gsap.to(this.material.uniforms.progress,{
                duration: 1,
                delay: 1.5,
                value: 1
            })

            gsap.to(this.material.uniforms.distortion, {
                duration: 2,
                value: 2,
                delay: 0,
                ease: "power2.inOut"
            })

            gsap.to(this.material.uniforms.distortion, {
                duration: 2,
                value: 0,
                delay: 2,
                ease: "power2.inOut"
            })

            gsap.to(this.bloompass, {
                duration: 2,
                strength: 0,
                delay: 2,
                ease: "power2.out",
                onComplete:() => {
                    this.video.currentTime = 0;
                    this.video.play(),
                    gsap.to(this.video, {
                        duration: 0.1,
                        opacity: 1
                    })
                }
               
            })

         
            
        })

        // METHODS
        this.addPost()
        this.resize()
        this.addObjects()
        this.render();
        this.setupResize()
        //this.addlights()
        this.settings()
      /*   this.loader = new GLTFLoader()
        this.loader.load(
            '/model/polygonza.glb', 
            (gltf) => {
                this.scene.add(gltf.scene);
                gltf.scene.traverse(o => {
                    if(o.isMesh){
                        o.rotation.x = Math.PI
                        o.position.x = 0.5
                        o.geometry.center()
                        
                        o.scale.set(.40,.40,.40)
                        o.material = this.material
                    }
                })
               



        }) */
    }

    addPost(){
        this.renderscene = new RenderPass(this.scene, this.camera)

        this.bloompass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight), 1.5,0.4,0.85);
        this.bloompass.threshold = this.bloompass.bloomThreshold
        this.bloompass.strength = this.bloompass.bloomStrength
        this.bloompass.radius = this.bloompass.bloomRadius

        this.composer = new EffectComposer(this.renderer)
        this.composer.addPass(this.renderscene)
        this.composer.addPass(this.bloompass)

        




    }

    settings(){
        let that = this
        this.settings = {
            distortion: 0,
            bloomStrength: 0,
            progress: 0
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, 'distortion',0,3,0.001)
        this.gui.add(this.settings, 'bloomStrength',0,10,0.001)

    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(this.width, this.height)

    }

    setupResize(){
        window.addEventListener('resize',this.resize.bind(this));
    }

    addObjects(){
        this.geometry = new THREE.PlaneBufferGeometry( 460, 820,460,820);
          //f  this.geometry = new THREE.SphereBufferGeometry( 0.5, 12,10);
        console.log(this.geometry)
        this.material = new THREE.ShaderMaterial({
            // wireframe: true,
            uniforms: {
                time: { value: 1.0 },
                distortion: {value: 0},
                progress: {value: 0},
                uTexture: {value: new THREE.TextureLoader().load(testTexture)},
                uTexture1: {value: new THREE.TextureLoader().load(testTexture1)},
                resolution: { value: new THREE.Vector2() }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide
        })

        this.mesh = new THREE.Points( this.geometry, this.material );
        this.scene.add( this.mesh ); 
    }

    addlights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        this.scene.add(directionalLight)
    }

    render(){
        this.time += 0.05;
        

        this.material.uniforms.time.value = this.time;
        //this.material.uniforms.distortion.value = this.settings.distortion;
        //this.bloompass.strength = this.settings.bloomStrength

        
        requestAnimationFrame(this.render.bind(this))
        /* this.renderer.render( this.scene, this.camera ); */
        this.composer.render()
        // console.log(this.time);
        
    }

}

new Sketch({
    domElement: document.getElementById('container')
});

