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

var onRenderFcts = [];
var arToolkitContext, arMarkerControls, arMarkerControls1;
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
const fbxLoader1 = new FBXLoader();
var markerRoot1 = new THREE.Group;
var amusementParkObj;

const fbxLoader2 = new FBXLoader();
var markerRoot2 = new THREE.Group;
var airportObj;

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

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot1
	//////////////////////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1.name = 'marker1'
	scene.add(markerRoot1)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-carousel.patt'
	})

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot2
	//////////////////////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot2.name = 'marker2'
	scene.add(markerRoot2)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot2, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-airport.patt',
	})

	/*// MARKER 
	arMarkerControls = new ArMarkerControls(arToolkitContext, camera, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-carousel.patt',
		//patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	})

	//scene.visible = false

	console.log('ArMarkerControls', arMarkerControls);
	window.arMarkerControls = arMarkerControls;*/
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

fbxLoader1.load(
    'https://mlmirabelli.github.io/webartest/media/carousel.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			/*textureLoader.load( 'https://mlmirabelli.github.io/webartest/media/Plane_diffuse.png', ( texture ) => {   
				const planeMaterial = new THREE.MeshStandardMaterial( {
                    color: 0xffffff,
                    metalness: 0,
                    roughness: 0,
					map: texture,
					depthTest: true,
        			depthWrite: true
                } );*/
				//child.material.map = texture;
				//child.material = planeMaterial;
				child.material = new THREE.MeshNormalMaterial({
					side: THREE.DoubleSide
				});
				child.material.needsupdate = true;
				//console.log(texture)
				// render(); // only if there is no render loop
				}
				//console.log( child.geometry.attributes.uv );
			});
			//child.material = new THREE.MeshNormalMaterial();
			//child.material.needsUpdate = true;
		object.position.y += 1;
		object.position.z += 0.5;
		object.rotation.x -= Math.PI / 2;
		object.scale.set(0.05, 0.05, 0.05); 
		amusementParkObj = object;
        markerRoot1.add(amusementParkObj);
    },
    (xhr) => {
        console.log('Amusement Park Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

onRenderFcts.push(function (delta) {
	amusementParkObj.rotation.y += Math.PI * delta / 2
})

fbxLoader2.load(
    'https://mlmirabelli.github.io/webartest/media/Plane.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshNormalMaterial({
					side: THREE.DoubleSide
				});
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1;
		//object.position.z += 0.5;
		//object.rotation.x -= Math.PI / 2;
		object.scale.set(0.05, 0.05, 0.05); 
		airportObj = object;
        markerRoot2.add(airportObj);
    },
    (xhr) => {
        console.log('Airport Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

onRenderFcts.push(function (delta) {
	if(airportObj.position.z < 1){
		airportObj.position.z += 0.1
	}
	else
	{
		airportObj.position.z -= 0.1
	}
})


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
