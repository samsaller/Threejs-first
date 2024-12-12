import * as THREE from "three";

function KeyboardController(keys, repeat) {
    var timers = {};
    document.onkeydown = function (event) {
        var key = event.code;
        if (!(key in keys)) return true;
        if (!(key in timers)) {
            timers[key] = null;
            keys[key]();
            if (repeat !== 0) timers[key] = setInterval(keys[key], repeat());
        }
        return false;
    };
    document.onkeyup = function (event) {
        var key = event.code;
        if (key in timers) {
            if (timers[key] !== null) clearInterval(timers[key]);
            delete timers[key];
        }
    };
    window.onblur = function () {
        for (let key in timers)
            if (timers[key] !== null) clearInterval(timers[key]);
        timers = {};
    };
}

const scene = new THREE.Scene();
const canvas = document.querySelector(".canvas");

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 2;
scene.add(camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const red = new THREE.MeshBasicMaterial({
    color: "red"
});
const black = new THREE.MeshBasicMaterial({
    color: "#303030"
});
const white = new THREE.MeshBasicMaterial({
    color: "white"
});
const cube = new THREE.Group();
const body = new THREE.Mesh(geometry, red)
const head = new THREE.Mesh(geometry, black)
const eye1 = new THREE.Mesh(geometry, white)
const eye2 = new THREE.Mesh(geometry, white)
head.position.x = 0.75
eye1.position.set(1,0.25,0.15)
eye2.position.set(1,0.25,-0.15)
head.scale.set(0.5, 0.5 ,0.5)
eye1.scale.set(0.15, 0.15 ,0.15)
eye2.scale.set(0.15, 0.15 ,0.15)

cube.add(body)
cube.add(head)
cube.add(eye1)
cube.add(eye2)

scene.add(cube);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

renderer.setSize(width, height);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const clock = new THREE.Clock();
var delta = clock.getDelta();


const tick = () => {
    camera.lookAt(cube.position);
    delta = clock.getDelta();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();

let speed = 1;

KeyboardController(
    {
        KeyW: () => {
            cube.position.x += speed * delta;

        },
        KeyS: () => {
            cube.position.x -= speed * delta;
        },
        KeyA: () => {
            cube.position.z -= speed * delta;

        },
        KeyD: () => {
            cube.position.z += speed * delta;
        },
    },
    () => {
        return delta * 1000;
    }
);
