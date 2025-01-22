import * as THREE from 'three';
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
var arToolkitContext, arMarkerControls;
initARContext();

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
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


function initARContext() { // create atToolkitContext
	arToolkitContext = new ArToolkitContext({
		cameraParametersUrl: './media/camera_para.dat',
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
		patternUrl: './media/viewer-pattern.patt',
		//patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	})

	scene.visible = false

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
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({
	transparent: true,
	opacity: 0.5,
	side: THREE.DoubleSide
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = geometry.parameters.height / 2
scene.add(mesh);

var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.5
scene.add(mesh);

onRenderFcts.push(function (delta) {
	mesh.rotation.x += Math.PI * delta
})

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
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












/*renderer.setAnimationLoop( animate );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

renderer.render( scene, camera );

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

=======
import * as THREE from 'three';
import * as THREEX from 'threex';
import * as ARjs from 'arjs';
import { ArToolkitSource, ArToolkitContext, ArMarkerControls }  from 'threex'

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
var arToolkitContext, arMarkerControls;
initARContext();

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
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


function initARContext() { // create atToolkitContext
	arToolkitContext = new ArToolkitContext({
		cameraParametersUrl: './media/camera_para.dat',
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
		patternUrl: './media/pattern-kanji.patt',
		//patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
		// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
		changeMatrixMode: 'cameraTransformMatrix'
	})

	scene.visible = false

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
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({
	transparent: true,
	opacity: 0.5,
	side: THREE.DoubleSide
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = geometry.parameters.height / 2
scene.add(mesh);

var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
var material = new THREE.MeshNormalMaterial();
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.5
scene.add(mesh);

onRenderFcts.push(function (delta) {
	mesh.rotation.x += Math.PI * delta
})

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
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












/*renderer.setAnimationLoop( animate );


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

renderer.render( scene, camera );

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}*/