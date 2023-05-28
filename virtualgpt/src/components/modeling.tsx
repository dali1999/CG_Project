import React, { useEffect, useState } from 'react'
import { addIronMan, addFurniture, addDoor,addWall } from './objects'

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
import '@babylonjs/loaders'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, rootReducer } from '../redux/modules/reducer'
import { changeTextInput, askGpt } from '../redux/modules/actions'

let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

let ground: Mesh
let wall1: Mesh
let wall2: Mesh
let wall3: Mesh
let wall4: Mesh
let ceiling: Mesh

let sphere

const PI = Math.PI

const onSceneReady = async (scene: Scene) => {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera('camera1', new Vector3(0, 40, 100), scene)
    // const camera = new ArcRotateCamera(
    //     'camera',
    //     -Math.PI / 2,
    //     Math.PI / 2.5,
    //     10,
    //     new Vector3(0, 100, 100)
    // )
        
    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero())
    camera.angularSensibility = 2000
     camera.speed=2
   
    const canvas = scene.getEngine().getRenderingCanvas()

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // Set the camera as the active camera
    scene.activeCamera = camera

    const assumedFramesPerSecond = 60
    const earthGravity = -20.81
    scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0)
     camera.applyGravity = true

   camera.ellipsoid = new Vector3(15, 15, 15)
    scene.collisionsEnabled = true
    camera.checkCollisions = true

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.4

    //Plain ground
    ground = MeshBuilder.CreateGround('ground', { width: 100, height: 300 })
    ground.position = new Vector3(0, 2, 0)
    ground.checkCollisions = true
    ground.isVisible=false

    //wall
    // wall1 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    // wall1.position = new Vector3(0, 15, -50)
    // wall1.rotation = new Vector3(PI / 2, 0, 0)
    // wall1.checkCollisions = true

    wall2 = MeshBuilder.CreateGround('ground', { width: 500, height: 30 })
    wall2.position = new Vector3(-50, 15, 0)
    wall2.rotation = new Vector3(PI / 2, PI / 2, 0)
    wall2.checkCollisions = true
    wall2.isVisible=false

    wall3 = MeshBuilder.CreateGround('ground', { width: 500, height: 30 })
    wall3.position = new Vector3(50, 15, 0)
    wall3.rotation = new Vector3(PI / 2, 0, PI / 2)
    wall3.checkCollisions = true
    wall3.isVisible=false
    // wall4 = MeshBuilder.CreateGround('ground', { width: 100, height: 30 })
    // wall4.position = new Vector3(0, 15, 50)
    // wall4.rotation = new Vector3(PI / 2, -PI / 2, PI / 2)
    // wall4.checkCollisions = true

    // ceiling = MeshBuilder.CreateGround('ground', { width: 100, height: 100 })
    // ceiling.position = new Vector3(0, 30, 0)
    // ceiling.rotation = new Vector3(PI, 0, 0)
    // ceiling.checkCollisions = true

    //ground.checkCollisions = true;
    const gravity = new Vector3(0, -10, 0)

    const hk = await HavokPhysics()
    const babylonPlugin = new HavokPlugin(true, hk)
    scene.enablePhysics(gravity, babylonPlugin)

    addIronMan(scene)
    addFurniture(scene)
    addDoor(scene)
   addWall(scene)
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
    if (ground !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime()
        //scene.cameras[0].position.y=25
        const rpm = 10
        //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
}

export default () => {
    const [ask, setAsk] = useState('')
    const handleChange = ({ target: { value } }: any) => setAsk(value)
    const dispatch = useDispatch()
    const textInputState = useSelector(
        (state: RootState) => state.textInputReducer
    )
    const gptRespnseState = useSelector(
        (state: RootState) => state.gptAskReducer
    )
    //   const pickBox2=()=>{
    //    dispatch(changeTextInput())
    //   }
    useEffect(() => {
        const canvas: any = document.getElementById('modeler')
        const engine: any = new Engine(canvas)

        canvas.width = 1000
        canvas.height = 500
    }, [])

    const handleSubmit = async (event: any) => {
        console.log(ask)
        event.preventDefault()
        await dispatch(askGpt(ask))
        //const gptRespnseState=store.getState((state:RootState)=>state.gptAskReducer)
        console.log(gptRespnseState)
    }

    return (
        <div>
            <SceneComponent
                antialias
                onSceneReady={onSceneReady}
                onRender={onRender}
                id="modeler"
            />
            <div>
                {textInputState.toggle ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="askGpt"
                            placeholder="Ask to gpt"
                            value={ask}
                            onChange={handleChange}
                        ></input>{' '}
                        <button type="submit">질문</button>
                    </form>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}
