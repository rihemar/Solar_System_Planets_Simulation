import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//READ URL

const planet_name= new URLSearchParams(window.location.search).get("planet");
console.log(planet_name);
const saturnRingGroup = new THREE.Group();


const planetToFile = {
    earth : "./images/8k_earth_daymap.jpg",
    mercury : "./images/2k_mercury.jpg",
    neptune : "./images/2k_neptune.jpg",
    uranus : "./images/2k_uranus.jpg",
    jupiter : "./images/8k_jupiter.jpg",
    mars : "./images/8k_mars.jpg",
    saturn : "./images/8k_saturn.jpg",
    sun : "./images/8k_sun.jpg",
    venus : "./images/2k_venus.jpg",
    moon : "./images/8k_moon.jpg",
    }




const scene = new THREE.Scene();
// Remove fog if any
scene.fog = null;
// Add ambient light for even lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // softer
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // softer
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // higher quality
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Load texture
const textureLoader = new THREE.TextureLoader();
// scene.background = bgTexture;
const bgTexture = textureLoader.load('./images/space2.jpg');
//PLANET 
let planet;
console.log(planetToFile[planet_name]);
console.log('earth')
console.log(Object.keys(planetToFile)); // To see what keys exist

planet_func(planetToFile[planet_name]);
if(planet_name =="saturn"){ring(saturnRingGroup)}
//RING
// ring();

// Camera
camera.position.z = 7;


// Orbit Controls (mouse controlled)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth motion
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;

// Animate
function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.001; // slow rotation
    controls.update();
    renderer.render(scene, camera);
}
addStars();
animate();
function addStars(){
            // Create stars
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000; // number of stars
        const starVertices = [];

        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 200; // spread in X
            const y = (Math.random() - 0.5) * 200; // spread in Y
            const z = (Math.random() - 0.5) * 200; // spread in Z
            if(x**2+y**2+z**2>17){
                starVertices.push(x, y, z);
            }
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        // Material for stars
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2, // tiny dots
        });

        // Points object
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

}


function planet_func(w){
    const planetTexture = textureLoader.load(w);
    // Create bigger sphere
    const geometry = new THREE.SphereGeometry(3, 512, 512); 
    const material = new THREE.MeshStandardMaterial({ map: planetTexture });
    planet = new THREE.Mesh(geometry, material);
    scene.add(planet);
}



function ring(saturnRingGroup){
        // Parameters
    // const saturnRingGroup = new THREE.Group();
    const saturnPosition = new THREE.Vector3(0, 0, 0); // Saturn center
    const innerRadius = 3.25;
    const outerRadius = 4.5;
    const ringSegments = 64;

    // Create multiple concentric rings with varying colors and opacity
    const ringColors = [
        0xd6c498, // light brown
        0xbfa06b, // medium brown
        0x9b7a50, // darker brown
        0x8a6b4f  // more subtle dark
    ];

    for (let i = 0; i < ringColors.length; i++) {
        const radiusStart = innerRadius + (i * (outerRadius - innerRadius) / ringColors.length);
        const radiusEnd = innerRadius + ((i + 1) * (outerRadius - innerRadius) / ringColors.length);

        const ringGeom = new THREE.RingGeometry(radiusStart, radiusEnd, ringSegments);
        const ringMat = new THREE.MeshStandardMaterial({
            color: ringColors[i],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });

        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2; // align with equator
        ringMesh.position.copy(saturnPosition);
        saturnRingGroup.add(ringMesh);
    }

    // Optional: tilt the ring slightly like real Saturn
    const tilt = THREE.MathUtils.degToRad(26.7);
    saturnRingGroup.rotation.z = tilt;

    scene.add(saturnRingGroup);
}
// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
    


// DISPATCHES   TEST (not efficient)


/**

triggerDoubleClick()

function triggerDoubleClick() {
    // const element = document.querySelector('#my-element'); // target element

    // if (!element) return;

    const dblClickEvent = new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    body.dispatchEvent(dblClickEvent);
}

// Example: call it whenever you want
someGestureDetected = true;
if (someGestureDetected) {
    triggerDoubleClick();
}

**/



// DIRECT ROTATION MANIPULATION

// let prev_gesture={gesture:"",x:0,y:0}
// let break_point =0;
// const coefficient = 0.01;
// async function fetch_controls(){
//     try {
//         const response= await fetch("http://localhost:5000/gesture");
//         // console.log("here");
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         let response_json = await response.json();
//         // console.log(response_json);
//         // if(response_json.gesture == "closed palm"){
//         //     break_point++;
//         //     window.history.back();
//         //     // prev_gesture ={gesture:"closed palm",x:0,y:0}
//         // }
//         // console.log(response_json.gesture)
//         if(response_json.gesture=="Pointing_Up"){
//             // console.log("in")
//             if(prev_gesture.gesture =="Pointing_Up"){
//             planet.rotation.x += (response_json["fingertip encoding x"] - prev_gesture.x)*coefficient
//             planet.rotation.y += (response_json["fingertip encoding y"] - prev_gesture.y)*coefficient
//             }
        
//         prev_gesture["gesture"]= "Pointing_Up";
//         prev_gesture["x"]= response_json["fingertip encoding x"] ;
//         prev_gesture["y"]= response_json["fingertip encoding y"];}
//         else{
//             break_point++;
//             if(break_point>7){
//                 break_point=0;
//                 prev_gesture["gesture"]= "";
                


//             }
//         }

//         // animate();

//     }
//     catch(e){
//         console.log("error occured : ",e)    
//     }
// }

// setInterval(fetch_controls, 100); // every 100 ms

let prev_gesture = {gesture:"", x:0, y:0};
let break_point = 0;
const coefficient = 0.005;

async function fetch_controls() {
    try {
        const response = await fetch("http://localhost:5000/gesture");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const gesture = data["gesture"];
        const fx = parseFloat(data["fingertip encoding x"]) || 0;
        const fy = parseFloat(data["fingertip encoding y"]) || 0;

        if (gesture === "Pointing_Up") {
            if (prev_gesture.gesture === "Pointing_Up") {
                const dx = -(fx - prev_gesture.x) * coefficient;
                const dy = (fy - prev_gesture.y) * coefficient;

                planet.rotation.x += dy;
                planet.rotation.y += dx;
                saturnRingGroup.rotation.x += dy;
                saturnRingGroup.rotation.y += dx

                console.log(`dx=${dx.toFixed(3)}, dy=${dy.toFixed(3)}`);
            }

            // update memory
            prev_gesture = {gesture: "Pointing_Up", x: fx, y: fy};
            break_point = 0; // reset counter if still pointing
        } 
        else {
            break_point++;
            if (break_point > 3) {
                break_point = 0;
                prev_gesture = {gesture:"", x:0, y:0};
                console.log("Gesture reset");
            }
        }

    } catch (e) {
        console.error("error occurred:", e);
    }
}

setInterval(fetch_controls, 100); // every 100 ms


// while (true){
//     fetch_controls();
// }




