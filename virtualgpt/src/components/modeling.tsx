
import React,{useState}  from 'react'
import { addTest, addAssets, addTree } from './objects'

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
    ActionManager,
    ExecuteCodeAction,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook' // if you install 'babylonjs-hook' NPM.
import HavokPhysics from '@babylonjs/havok'
import '../css/Modeling.css'
import Assets from '@babylonjs/assets'
import '@babylonjs/loaders'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import 'babylonjs-procedural-textures'
import { BrickProceduralTexture } from 'babylonjs-procedural-textures'
import { useSelector, useDispatch } from "react-redux";
import { RootState, rootReducer } from "../redux/modules/reducer";
import { changeTextInput,askGpt } from "../redux/modules/actions";
        
let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

let ground: Mesh
let wall1: Mesh
let wall2: Mesh
let wall3: Mesh
let wall4: Mesh

let sphere

const PI = Math.PI

const onSceneReady = async (scene: Scene) => {
    // This creates and positions a free camera (non-mesh)
    // var camera = new FreeCamera('camera1', new Vector3(100, 100, 100), scene)
    const camera = new ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        new Vector3(0, 100, 100)
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

    //Plain ground
    ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 })
    ground.position = new Vector3(0, 0, 0)
    ground.checkCollisions = true

    //wall
    wall1 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    wall1.position = new Vector3(0, 15, -50)
    wall1.rotation = new Vector3(Math.PI / 2, 0, 0)
    wall1.checkCollisions = true

    wall2 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    wall2.position = new Vector3(-50, 15, 0)
    wall2.rotation = new Vector3(Math.PI / 2, Math.PI / 2, 0)
    wall2.checkCollisions = true

    wall3 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    wall3.position = new Vector3(50, 15, 0)
    wall3.rotation = new Vector3(Math.PI / 2, 0, Math.PI / 2)
    wall3.checkCollisions = true

    wall4 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    wall4.position = new Vector3(0, 15, 50)
    wall4.rotation = new Vector3(Math.PI / 2, -Math.PI / 2, Math.PI / 2)
    wall4.checkCollisions = true

    //ground.checkCollisions = true;
    const gravity = new Vector3(0, -10, 0)

    const hk = await HavokPhysics()
    const babylonPlugin = new HavokPlugin(true, hk)
    scene.enablePhysics(gravity, babylonPlugin)
    // Our built-in 'ground' shape.
    //MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    addAssets(scene)
    addTest(scene)
    addTree(scene)

    
}

// const addSphere = (scene: Scene) => {
//     // Create a sphere above the ground============================
//     sphere = MeshBuilder.CreateSphere('sphere', { diameter: 10 }, scene)
//     sphere.position = new Vector3(0, 0, 0)
//     const material = new StandardMaterial('boxMaterial', scene)
//     material.diffuseColor = new Color3(1, 0.5, 0) // Orange color
//     sphere.material = material
// }

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

  const [ask, setAsk] = useState("");
  const handleChange = ({ target: { value } }:any) => setAsk(value);
  const dispatch = useDispatch()
  const textInputState=useSelector((state:RootState)=>state.textInputReducer)
  const pickBox2=()=>{
   dispatch(changeTextInput())
  }
  
  const handleSubmit=async(event:any)=>{
    console.log(ask)
    event.preventDefault();
    await dispatch(askGpt(ask))
  }
  

export default () => (
    <div>
        <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            id="modeler"
        />
        <div>
        {
          textInputState.toggle?
          <form onSubmit={handleSubmit}>
            <input
        type="text" className="askGpt"
        placeholder="Ask to gpt" value={ask}
        onChange={handleChange}
        ></input> <button type="submit">질문</button>
          </form>
          :''
        }
        </div>
    </div>
)