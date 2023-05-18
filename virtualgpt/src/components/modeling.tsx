import React from 'react'
import {
    FreeCamera,
    ArcRotateCamera,
    Vector3,
    Color3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SceneLoader,
    Mesh,
    HavokPlugin,
    Engine,
    KeyboardEventTypes,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook' // if you install 'babylonjs-hook' NPM.
import '../css/Modeling.css'
import HavokPhysics from '@babylonjs/havok'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

let ground: Mesh
let sphere
let village

// const cameraSpeed = 0.5

const onSceneReady = async (scene: Scene) => {
    // This creates and positions a free camera (non-mesh)
    // var camera = new FreeCamera('camera1', new Vector3(100, 100, 100), scene)
    const camera = new ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        new Vector3(0, 300, 300)
    )
    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())

    const canvas = scene.getEngine().getRenderingCanvas()

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // Set the camera as the active camera
    scene.activeCamera = camera

    const assumedFramesPerSecond = 60
    const earthGravity = -90.81
    scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0)
    // camera.applyGravity = true

    // camera.ellipsoid = new Vector3(1, 1, 1)
    scene.collisionsEnabled = true
    camera.checkCollisions = true

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.4
    
    ground = MeshBuilder.CreateGround('ground', { width: 300, height: 300 })
    
    ground.position.y = -5
    ground.position.x = 0
    ground.position.z = 0
    ground.checkCollisions = true

    //ground.checkCollisions = true;
    const gravity = new Vector3(0, -10, 0)

    const hk = await HavokPhysics()
    const babylonPlugin = new HavokPlugin(true, hk)
    scene.enablePhysics(gravity, babylonPlugin)
    // Our built-in 'ground' shape.
    //MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    addSphere(scene)
}

const addSphere = (scene: Scene) => {
    // Create a sphere above the ground============================
    sphere = MeshBuilder.CreateSphere('sphere', { diameter: 10 }, scene)
    sphere.position = new Vector3(0, 0, 0)
    const material = new StandardMaterial('boxMaterial', scene)
    material.diffuseColor = new Color3(1, 0.5, 0) // Orange color
    sphere.material = material
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
    if (ground !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime()

        const rpm = 10
        //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
}

export default () => (
    <div>
        <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            id="modeler"
        />
    </div>
)
