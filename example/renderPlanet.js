import {
	GlobeControls,
	TilesRenderer,
} from '3d-tiles-renderer';
import {
	CesiumIonAuthPlugin,
	UpdateOnChangePlugin,
	TileCompressionPlugin,
	TilesFadePlugin,
} from '3d-tiles-renderer/plugins';
import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
} from 'three';

let controls, scene, camera, renderer, tiles;
// const useMars = new URLSearchParams( location.search ).has( 'mars' );
// const assetId = useMars ? '3644333' : '3644333';
// const assetId = '3644333'; // Mars
const assetId = '2684829'; // Moon
// const assetId = '2275207'; // Earth


const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTlkNzk3YS0yM2IxLTRmYWYtODc5MS02M2YyNjkzNmQzZjkiLCJpZCI6MzM4ODI5LCJpYXQiOjE3NTcxMDQ2NjZ9.7RgeHjh-f7pfr7d46y4Jmh0-3kOX3CGCLBcW-LlGTbI"
init();

animate();

function reinstantiateTiles() {

	if ( tiles ) {

		scene.remove( tiles.group );
		tiles.dispose();
		tiles = null;

	}

	tiles = new TilesRenderer();
	tiles.registerPlugin( new CesiumIonAuthPlugin( { apiToken: apiKey, assetId: assetId, autoRefreshToken: true } ) );
	tiles.registerPlugin( new TileCompressionPlugin() );
	tiles.registerPlugin( new UpdateOnChangePlugin() );
	tiles.registerPlugin( new TilesFadePlugin() );
	tiles.group.rotation.x = - Math.PI / 2;
	scene.add( tiles.group );

	tiles.setCamera( camera );
	controls.setEllipsoid( tiles.ellipsoid, tiles.group );

}

function init() {

	// renderer
	renderer = new WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0x131619 );
	document.body.appendChild( renderer.domElement );

	// scene
	scene = new Scene();
	camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 160000000 );
	camera.position.set( 2620409, 0, - 6249816 ).multiplyScalar(1 );//changed
	camera.lookAt( 0, 0, 0 );

	// controls
	controls = new GlobeControls( scene, camera, renderer.domElement, null );
	controls.enableDamping = true;

	// initialize tiles
	reinstantiateTiles();

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	const aspect = window.innerWidth / window.innerHeight;
	camera.aspect = aspect;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );

}

function animate() {

	requestAnimationFrame( animate );

	if ( ! tiles ) return;

	controls.update();

	// update options
	tiles.setResolutionFromRenderer( camera, renderer );

	// update tiles
	camera.updateMatrixWorld();
	tiles.update();

	renderer.render( scene, camera );

}
