const socket = io("http://localhost:3000"); // Change this to your server URL when deployed

let scene, camera, renderer, playerCar, cars = {};

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const carGeometry = new THREE.BoxGeometry(1, 1, 2);
    const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    playerCar = new THREE.Mesh(carGeometry, carMaterial);
    scene.add(playerCar);

    socket.on("updatePlayers", (updatedPlayers) => {
        Object.keys(cars).forEach(id => {
            if (!updatedPlayers[id]) {
                scene.remove(cars[id]);
                delete cars[id];
            }
        });

        Object.entries(updatedPlayers).forEach(([id, data]) => {
            if (!cars[id]) {
                const car = new THREE.Mesh(carGeometry, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
                scene.add(car);
                cars[id] = car;
            }
            cars[id].position.set(data.x, data.y, data.z);
            cars[id].rotation.y = data.rotation;
        });
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

document.addEventListener("keydown", (event) => {
    if (!playerCar) return;

    if (event.key === "ArrowUp") playerCar.position.z -= 0.2;
    if (event.key === "ArrowDown") playerCar.position.z += 0.2;
    if (event.key === "ArrowLeft") playerCar.rotation.y += 0.1;
    if (event.key === "ArrowRight") playerCar.rotation.y -= 0.1;

    socket.emit("move", {
        x: playerCar.position.x,
        y: playerCar.position.y,
        z: playerCar.position.z,
        rotation: playerCar.rotation.y
    });
});

init();
