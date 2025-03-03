import * as THREE from 'three';
import { FBXLoader } from 'fbxloader';
import { OBJLoader } from 'objloader';
import { ArToolkitSource, ArToolkitContext, ArMarkerControls }  from 'threex';

ArToolkitContext.baseURL = '../'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
	logarithmicDepthBuffer: true 
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
const modelLoader1 = new FBXLoader();
var markerRoot1 = new THREE.Group;

const modelLoader2 = new FBXLoader();
var markerRoot2 = new THREE.Group;

const modelLoader3 = new OBJLoader();
const modelLoader30 = new FBXLoader();
const modelLoader31 = new FBXLoader();
var markerRoot3 = new THREE.Group;

const modelLoader4 = new FBXLoader();
const modelLoader40 = new FBXLoader();
const modelLoader41 = new FBXLoader();
var markerRoot4 = new THREE.Group;

const modelLoader50 = new FBXLoader();
const modelLoader51 = new FBXLoader();
const modelLoader52 = new FBXLoader();
var markerRoot5 = new THREE.Group;

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

	markerRoot2.name = 'marker2'
	scene.add(markerRoot2)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot2, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-airport.patt',
	})

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot3
	//////////////////////////////////////////////////////////////////////////////

	markerRoot3.name = 'marker3'
	scene.add(markerRoot3)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot3, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-volcano.patt',
	})

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot4
	//////////////////////////////////////////////////////////////////////////////

	markerRoot4.name = 'marker4'
	scene.add(markerRoot4)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot4, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-factory.patt',
	})

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot5
	//////////////////////////////////////////////////////////////////////////////

	markerRoot5.name = 'marker5'
	scene.add(markerRoot5)
	var markerControls = new ArMarkerControls(arToolkitContext, markerRoot5, {
		type: 'pattern',
		patternUrl: 'https://mlmirabelli.github.io/webartest/media/pattern-marias.patt',
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
var normalMaterial = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide,
	flatShading: true
});

modelLoader1.load(
    'https://mlmirabelli.github.io/webartest/media/carousel.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1;
		object.position.z += 0.5;
		object.rotation.x -= Math.PI / 2;
		object.scale.set(0.05, 0.05, 0.05); 
        markerRoot1.add(object);

		onRenderFcts.push(function (delta) {
			object.rotation.y += Math.PI * delta / 2
		})
    },
    (xhr) => {
        console.log('Amusement Park Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader2.load(
    'https://mlmirabelli.github.io/webartest/media/basic_plane_model.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1;
		object.position.z -= 0.25;
		object.rotation.y -= Math.PI/ 2;
		object.rotation.x -= Math.PI / 2;
		object.scale.set(0.00125, 0.00125, 0.00125); 
        markerRoot2.add(object);

		var ogVerticalPosition = object.position.z;
		var movDirection = 1;
		var movDisplacement = 0.25;

		onRenderFcts.push(function (delta) {
			if(object.position.z >= (ogVerticalPosition + movDisplacement) || object.position.z <= (ogVerticalPosition - movDisplacement)){
				movDirection *= -1;
			}

			object.position.z += 0.01*movDirection
		})
    },
    (xhr) => {
        console.log('Airport Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader3.load(
    'https://mlmirabelli.github.io/webartest/media/volcano.obj',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1;
		object.rotation.y += Math.PI;
		object.rotation.x -= Math.PI / 2;
		object.scale.set(0.65, 0.65, 0.65); 
        markerRoot3.add(object);

		const planeGeo = new THREE.PlaneGeometry( 1.5, 1.15 );
		const plane = new THREE.Mesh( planeGeo, normalMaterial );
		plane.position.y += 1;
		plane.position.z += 0.2;
		markerRoot3.add( plane );
    },
    (xhr) => {
        console.log('Volcano Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader30.load(
    'https://mlmirabelli.github.io/webartest/media/z.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});

		const ogPositionX = object.position.x;
		const ogPositionY = object.position.y;
		const ogPositionZ = object.position.z;

		object.rotation.y += Math.PI / 8;
		object.position.y += 0.9;
		object.position.z -= 0.2;
		object.position.x += 0.2;
		object.scale.set(0, 0, 0); 
        markerRoot3.add(object);

		const ogPosition = new THREE.Vector3(ogPositionX + 0.2, ogPositionY + 1, ogPositionZ - 0.2);
		const finalPosition = new THREE.Vector3(ogPositionX + 0.6, ogPositionY + 1, ogPositionZ - 0.6);
		const totalDistance = ogPosition.distanceTo(finalPosition);
		const ogScale = 0;
		const finalScale = new THREE.Vector3(0.004, 0.004, 0.004);
		const steps = 100;
		const distancePerStep = totalDistance/steps;

		onRenderFcts.push(function (delta) {
			if(object.position.x + 0.0005 < finalPosition.x)
			{
				const currentDistance = object.position.distanceTo(finalPosition);
				var rateOfChange = distancePerStep/currentDistance;
				object.position.lerp(finalPosition, rateOfChange);
				object.scale.lerp(finalScale, rateOfChange);
			}
			else
			{
				object.position.set(ogPosition.x, ogPosition.y, ogPosition.z);
				object.scale.set(ogScale, ogScale, ogScale);
			}
		})
    },
    (xhr) => {
        console.log('z0 Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader31.load(
    'https://mlmirabelli.github.io/webartest/media/z.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});

		const ogPositionX = object.position.x;
		const ogPositionY = object.position.y;
		const ogPositionZ = object.position.z;

		object.rotation.y += Math.PI / 8;
		object.position.y += 1.1;
		object.position.z -= 0.4;
		object.position.x += 0.4;
		object.scale.set(0.002, 0.002, 0.002); 
        markerRoot3.add(object);

		const ogPosition = new THREE.Vector3(ogPositionX + 0.2, ogPositionY + 1, ogPositionZ - 0.2);
		const finalPosition = new THREE.Vector3(ogPositionX + 0.6, ogPositionY + 1, ogPositionZ - 0.6);
		const totalDistance = ogPosition.distanceTo(finalPosition);
		const ogScale = 0;
		const finalScale = new THREE.Vector3(0.004, 0.004, 0.004);
		const steps = 100;
		const distancePerStep = totalDistance/steps;

		onRenderFcts.push(function (delta) {
			if(object.position.x + 0.0005 < finalPosition.x)
			{
				const currentDistance = object.position.distanceTo(finalPosition);
				var rateOfChange = distancePerStep/currentDistance;
				object.position.lerp(finalPosition, rateOfChange);
				object.scale.lerp(finalScale, rateOfChange);
			}
			else
			{
				object.position.set(ogPosition.x, ogPosition.y, ogPosition.z);
				object.scale.set(ogScale, ogScale, ogScale);
			}
		})
    },
    (xhr) => {
        console.log('z1 Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader4.load(
    'https://mlmirabelli.github.io/webartest/media/Factory.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1;
		object.position.z += 0.5;
		object.rotation.x -= Math.PI / 2;
		object.scale.set(0.00075, 0.00075, 0.00075); 
        markerRoot4.add(object);
    },
    (xhr) => {
        console.log('Factory Obj = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader40.load(
    'https://mlmirabelli.github.io/webartest/media/Scrap.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1.25;
		object.position.z -= 0.5;
		object.scale.set(0.0065, 0.0065, 0.0065); 
        markerRoot4.add(object);

		onRenderFcts.push(function (delta) {
			object.rotation.y += Math.PI * delta / 2
		})
    },
    (xhr) => {
        console.log('cog0 = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader41.load(
    'https://mlmirabelli.github.io/webartest/media/Scrap.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.position.y += 1.25;
		object.position.z -= 0.5;
		object.position.x += 0.375;
		object.scale.set(0.005, 0.005, 0.005); 
        markerRoot4.add(object);

		onRenderFcts.push(function (delta) {
			object.rotation.y -= Math.PI * delta / 2
		})
    },
    (xhr) => {
        console.log('cog0 = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader50.load(
    'https://mlmirabelli.github.io/webartest/media/maria0.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.rotation.x -= Math.PI / 2;
		object.rotation.y -= Math.PI / 4;
		object.position.y += 1;
		object.position.z += 0.5;
		object.scale.set(0.0025, 0.0025, 0.0025); 
        markerRoot5.add(object);

		onRenderFcts.push(function (delta) {
			object.rotation.y -= Math.PI * delta / 2
		})
    },
    (xhr) => {
        console.log('maria0 = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader51.load(
    'https://mlmirabelli.github.io/webartest/media/maria1.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.rotation.x -= Math.PI / 2;
		object.rotation.y += Math.PI / 3;
		object.position.y += 0.8;
		object.position.z += 0.5;
		object.position.x -= 0.4;
		object.scale.set(0.0025, 0.0025, 0.0025); 
        markerRoot5.add(object);
    },
    (xhr) => {
        console.log('maria1 = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

modelLoader52.load(
    'https://mlmirabelli.github.io/webartest/media/maria2.fbx',
    (object) => {
		object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
				child.material = normalMaterial;
				child.material.needsupdate = true;
				}
			});
		object.rotation.x -= Math.PI / 2;
		object.rotation.y += Math.PI / 2;
		object.position.y += 0.8;
		object.position.z += 0.5;
		object.position.x += 0.6;
		object.scale.set(0.0025, 0.0025, -0.0025); 
        markerRoot5.add(object);
    },
    (xhr) => {
        console.log('maria2 = ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
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