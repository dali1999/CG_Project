import React from "react";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Mesh,
  HavokPlugin
} from "@babylonjs/core";
import SceneComponent from "babylonjs-hook"; // if you install 'babylonjs-hook' NPM.
import "../css/Modeling.css";
import HavokPhysics from "@babylonjs/havok";
let initializedHavok;

HavokPhysics().then((havok) => {
  initializedHavok = havok;
});

let box :Mesh ;
let ground:Mesh;

const onSceneReady = async (scene:Scene) => {
  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 150,0 ), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  const assumedFramesPerSecond = 60;
  const earthGravity = -90.81;
  scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);
  camera.applyGravity = true;

  camera.ellipsoid = new Vector3(1, 1, 1);
  scene.collisionsEnabled = true;
  camera.checkCollisions = true;


  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 100 }, scene);
  //ground= MeshBuilder.CreatePlane("ground",{size:10})  
  // Move the box upward 1/2 its height
  box.position.y = 0;
  box.position.x= 0;
  box.position.z=0;
  box.checkCollisions = true;
  //ground.checkCollisions = true;
  const gravity = new Vector3(0, -10, 0);
  
    const hk = await HavokPhysics();
    const babylonPlugin =  new HavokPlugin(true, hk);
    scene.enablePhysics(gravity, babylonPlugin);
  // Our built-in 'ground' shape.
  //MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene:Scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="modeler"
    />
  </div>
);
