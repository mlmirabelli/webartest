import * as THREE from 'three';
import { FBXLoader } from 'fbxloader';
import { ArToolkitSource, ArToolkitContext, ArMarkerControls }  from 'threex';

ArToolkitContext.baseURL = '../'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("objs3D").appendChild( renderer.domElement );
renderer.gammaInput = true;
renderer.gammaOutput = true;

var aLight = new THREE.AmbientLight(0xffffff);
var dLight1 = new THREE.DirectionalLight(0xffffff);
var dLight2 = new THREE.DirectionalLight(0xffffff);
var dLight3 = new THREE.DirectionalLight(0xffffff);
dLight1.target(0, 0, 2);
dLight2.target(0, 0, 2);
dLight3.target(0, 0, 2);

dLight1.position.y +=3 ;
dLight1.position.z -=3 ; 

dLight2.position.y +=3 ; 
dLight2.position.x +=3 ; 
dLight2.position.z -=3 ; 

dLight3.position.y +=3 ; 
dLight3.position.x -=3 ; 
dLight3.position.z -=3 ; 

dLight1.castShadow = false;
dLight2.castShadow = false;
dLight3.castShadow = false;

const helper1 = new THREE.DirectionalLightHelper( dLight1, 5 );
const helper2 = new THREE.DirectionalLightHelper( dLight2, 5 );
const helper3 = new THREE.DirectionalLightHelper( dLight3, 5 );
scene.add(dLight1, dLight2, dLight3, dLight1.target, dLight2.target, dLight3.target, aLight, helper1, helper2, helper3);

var onRenderFcts = [];
var arToolkitContext, arMarkerControls;
scene.visible = false

var arToolkitSource = new ArToolkitSource({
	// to read from the webcam
	sourceType: 'webcam',

	sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
	sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
})

arToolkitSource.init(function onReady() {
	arToolkitSource.domElement.addEventListener('canplay', () => {
		console.log(
			'canplay',
			'actual source dimensions',
			arToolkitSource.domElement.videoWidth,
			arToolkitSource.domElement.videoHeight
		);

		initARContext();
	});
	window.arToolkitSource = arToolkitSource;
	setTimeout(() => {
		onResize()
	}, 2000);
})

// handle resize
window.addEventListener('resize', function () {
	onResize()
})

function onResize() {
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if (window.arToolkitContext.arController !== null) {
		arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas)
	}
}

////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext                                       //
////////////////////////////////////////////////////////////////////////////////


function initARContext() { // create atToolkitContext
	arToolkitContext = new ArToolkitContext({
		cameraParametersUrl: 'https://mlmirabelli.github.io/webartest/media/camera_para.dat',
		detectionMode: 'mono'
	})
	// initialize it
	arToolkitContext.init(() => { // copy projection matrix to camera
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

		arToolkitContext.arController.orientation = getSourceOrientation();
		arToolkitContext.arController.options.orientation = getSourceOrientation();

		console.log('arToolkitContext', arToolkitContext);
		window.arToolkitContext = arToolkitContext;
	})

	// MARKER
	arMarkerControls = new ArMarkerControls(arToolkitContext, camera, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-binoculars.patt',
		//patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	})

	//scene.visible = false

	console.log('ArMarkerControls', arMarkerControls);
	window.arMarkerControls = arMarkerControls;
}

function getSourceOrientation() {
	if (!arToolkitSource) {
		return null;
	}

	console.log(
		'actual source dimensions',
		arToolkitSource.domElement.videoWidth,
		arToolkitSource.domElement.videoHeight
	);

	if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) {
		console.log('source orientation', 'landscape');
		return 'landscape';
	} else {
		console.log('source orientation', 'portrait');
		return 'portrait';
	}
}

//update artoolkit on every frame
onRenderFcts.push(function () {
	if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
		return;
	}

	arToolkitContext.update(arToolkitSource.domElement)

	// update scene.visible if the marker is seen
	scene.visible = camera.visible
})

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene                                              //
//////////////////////////////////////////////////////////////////////////////////
const fbxLoader = new FBXLoader();
//const textureLoader = new THREE.TextureLoader();

fbxLoader.load(
    'https://mlmirabelli.github.io/webartest/media/AmusementPark-Island.fbx', //3DPointer.fbx
    (object) => {
		/*object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			textureLoader.load( 'https://mlmirabelli.github.io/webartest/media/Plane_diffuse.png', ( texture ) => {   
				const planeMaterial = new THREE.MeshStandardMaterial( {
                    color: 0xffffff,
                    metalness: 0,
                    roughness: 0,
					map: texture,
					depthTest: true,
        			depthWrite: true
                } );
				//child.material.map = texture;
				child.material = planeMaterial;
				child.material.needsupdate = true;
				console.log(texture)
				// render(); // only if there is no render loop
				});
				console.log( child.geometry.attributes.uv );
				
				child.castShadow = true;
				child.receiveShadow = true;

			}
			//child.material = new THREE.MeshNormalMaterial();
			//child.material.needsUpdate = true;
		})*/
		object.position.y += 1;
		object.rotation.x -= Math.PI / 2;
		//object.rotation.y -= Math.PI / 2;
		object.scale.set(0.01, 0.01, 0.01); 
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page                                      //
//////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function () {
	renderer.render(scene, camera);
})

// run the rendering loop
var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
	// keep looping
	requestAnimationFrame(animate);
	// measure time
	lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
	var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec = nowMsec
	// call each update function
	onRenderFcts.forEach(function (onRenderFct) {
		onRenderFct(deltaMsec / 1000, nowMsec / 1000)
	})
})
