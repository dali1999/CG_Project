import React from 'react'
import {
    Vector3,
    Color3,
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
import Assets from '@babylonjs/assets'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { store } from '..'
import { useSelector, useDispatch } from "react-redux";
import { changeTextInput,askGpt } from "../redux/modules/actions";
import { RootState } from '../redux/modules/reducer'

let initializedHavok

HavokPhysics().then((havok) => {
    initializedHavok = havok
})

const PI = Math.PI

const addTest = (scene: Scene) => {
    SceneLoader.ImportMesh(
        '',
        Assets.meshes.alien.rootUrl,
        Assets.meshes.alien.filename,
        scene,
        (meshes) => {
            const mesh = meshes[0]
            mesh.position.set(0, 10, 20)
            mesh.scaling.set(15, 15, 15)
            mesh.rotation = new Vector3(0, 0, 0)
            // const material = new StandardMaterial('boxMaterial', scene)
            // material.diffuseColor = asset.color
            // mesh.material = material
        }
    )
}

const addAssets = (scene: Scene) => {
    const assetsToLoad = [
        {
            url: Assets.meshes.alien.rootUrl,
            filename: Assets.meshes.alien.filename,
            position: new Vector3(0, 5, 0),
            scaling: new Vector3(10, 10, 10),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0, 0),
        },
        {
            url: Assets.meshes.crateStack_glb.rootUrl,
            filename: Assets.meshes.crateStack_glb.filename,
            position: new Vector3(10, 0, 10),
            scaling: new Vector3(2, 2, 2),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0.5, 0),
        },
        {
            url: Assets.meshes.snowMan.rootUrl,
            filename: Assets.meshes.snowMan.filename,
            position: new Vector3(10, 0, 30),
            scaling: new Vector3(2, 2, 2),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0.5, 0),
        },
        {
            url: Assets.meshes.dummy3.rootUrl,
            filename: Assets.meshes.dummy3.filename,
            position: new Vector3(10, 0, 0),
            scaling: new Vector3(3, 3, 3),
            rotation: new Vector3(0, 0, 0),
            // color: new Color3(1, 0.5, 0),
        },
    ]

    assetsToLoad.forEach((asset) => {
        SceneLoader.ImportMesh(
            '',
            asset.url,
            asset.filename,
            scene,
            (meshes) => {
                const mesh = meshes[0]
                mesh.position = asset.position
                mesh.rotation = asset.rotation
                mesh.scaling = asset.scaling
                // const material = new StandardMaterial('boxMaterial', scene)
                // material.diffuseColor = asset.color
                // mesh.material = material
            }
        )
    })
}

const tryChat=async()=>{
    await store.dispatch(changeTextInput())
}

const addIronMan=(scene:Scene)=>{
    // SceneLoader.Append("../assets/","IronMan.gltf",scene,(scene)=>{
    // })
    SceneLoader.ImportMesh('',"../assets/","IronMan.gltf",scene,(meshes)=>{
        console.log(meshes)

        for(var i=0;i<meshes.length;i++){
            const mesh = meshes[i]
            mesh.position.set(0, 0, 30)
            mesh.rotation = new Vector3(0, 0, 0)
            mesh.checkCollisions=true;
            mesh.actionManager=new ActionManager(scene)
            mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger,tryChat))
        }
        
    })
}

const addTree = (scene: Scene) => {
    SceneLoader.ImportMesh(
        '',
        Assets.meshes.tree1_glb.rootUrl,
        Assets.meshes.tree1_glb.filename,
        scene,
        (meshes) => {
            console.log(meshes)
            const mesh = meshes[0]
            mesh.position.set(0, 0, 30)
            mesh.scaling.setAll(2)
            mesh.rotation = new Vector3(0, 0, 0)
        }
    )
}

export { addTest, addAssets, addTree,addIronMan }
