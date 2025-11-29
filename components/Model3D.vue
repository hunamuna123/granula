<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, controls
let handleResize = null

onMounted(() => {
  if (!container.value) return

  // Создание сцены
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x09090b)

  // Создание камеры
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, 10)

  // Создание рендерера
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.shadowMap.enabled = true
  container.value.appendChild(renderer.domElement)

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Создание модели дома
  const houseGroup = new THREE.Group()

  // Основание
  const floorGeometry = new THREE.BoxGeometry(10, 0.2, 8)
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568 })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  houseGroup.add(floor)

  // Передняя стена
  const frontWallGeometry = new THREE.BoxGeometry(10, 4, 0.2)
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x718096 })
  const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial)
  frontWall.position.set(0, 2, 4)
  houseGroup.add(frontWall)

  // Задняя стена
  const backWall = new THREE.Mesh(frontWallGeometry.clone(), wallMaterial)
  backWall.position.set(0, 2, -4)
  houseGroup.add(backWall)

  // Левая стена
  const leftWallGeometry = new THREE.BoxGeometry(0.2, 4, 8)
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
  leftWall.position.set(-5, 2, 0)
  houseGroup.add(leftWall)

  // Правая стена
  const rightWall = new THREE.Mesh(leftWallGeometry.clone(), wallMaterial)
  rightWall.position.set(5, 2, 0)
  houseGroup.add(rightWall)

  // Крыша
  const roofGeometry = new THREE.BoxGeometry(11, 1, 9)
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xc53030 })
  const roof = new THREE.Mesh(roofGeometry, roofMaterial)
  roof.position.set(0, 5.5, 0)
  houseGroup.add(roof)

  // Дверь
  const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1)
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3748 })
  const door = new THREE.Mesh(doorGeometry, doorMaterial)
  door.position.set(0, 1, 4.1)
  houseGroup.add(door)

  // Окна
  const windowGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1)
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x63b3ed })
  
  const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
  window1.position.set(-3, 2.5, 4.1)
  houseGroup.add(window1)

  const window2 = new THREE.Mesh(windowGeometry, windowMaterial)
  window2.position.set(3, 2.5, 4.1)
  houseGroup.add(window2)

  const window3Geometry = new THREE.BoxGeometry(2, 2, 0.1)
  const window3 = new THREE.Mesh(window3Geometry, windowMaterial)
  window3.position.set(0, 2.5, -4.1)
  houseGroup.add(window3)

  scene.add(houseGroup)

  // Анимация
  function animate() {
    requestAnimationFrame(animate)
    if (controls) controls.update()
    renderer.render(scene, camera)
  }

  // Запускаем анимацию сразу
  animate()

  // Orbit Controls
  import('three/examples/jsm/controls/OrbitControls.js').then((module) => {
    const OrbitControls = module.OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  })

  // Обработка изменения размера
  handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
  if (renderer && container.value) {
    renderer.dispose()
    if (container.value.contains(renderer.domElement)) {
      container.value.removeChild(renderer.domElement)
    }
  }
})
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
