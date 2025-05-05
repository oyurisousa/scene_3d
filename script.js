// inicia a cena
const scene = new THREE.Scene();

//configura a câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//parte que renderiza
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//objeto para texturização
const textureLoader = new THREE.TextureLoader();
// carrega o background de Konoha
textureLoader.load('./assets/konoha_background.jpg', function (texture) {
    scene.background = texture;
});

// Controles de órbita (permite mover a câmera com mouse)
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// posição inicial da câmera
camera.position.z = 10;
camera.position.y = 3;

// parte de iluminação
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// simular luz do ambiente
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// ativa sombras
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

// Variáveis globais dos objetos
let cube, sphere, cylinder;

// Cubo
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
textureLoader.load('./assets/konoha.png', function (texture) {
    const cubeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 30,
        side: THREE.DoubleSide

    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
});

// Esfera 
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
textureLoader.load('./assets/uchiha.png', function (texture) {
    const sphereMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, -3, 0);
    sphere.castShadow = true;
    scene.add(sphere);
});

// Cilindro
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
textureLoader.load(
    './assets/pergaminho.png',
    function (texture) {
        const cylinderMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: false,
            bumpScale: 0.05,
        });
        cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(2, 3, 3);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        scene.add(cylinder);
    },
    undefined,
    function (error) {
        console.error('Erro ao carregar textura do pergaminho:', error);
        const cylinderMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b4513,
            side: THREE.DoubleSide,
        });
        cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(2, 0, 0);
        scene.add(cylinder);
    }
);

// Renderização e animações
function render() {
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    if (sphere) {
        sphere.scale.y = Math.abs(Math.sin(Date.now() * 0.001)) + 0.5;
    }

    if (cylinder) {
        cylinder.rotation.x += 0.01;
        cylinder.rotation.z += 0.02;
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();

// para o reponsividade
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Tecla K para efeito especial (Katon!)
document.addEventListener('keydown', (e) => {
    if (e.key === 'k' || e.key === 'K') {
        directionalLight.intensity = 2;
        setTimeout(() => {
            directionalLight.intensity = 1;
        }, 300);
    }
});
