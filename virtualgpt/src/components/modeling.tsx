import React,{useState} from "react";
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Mesh,
  HavokPlugin,
  ActionManager,
  ExecuteCodeAction,

} from "@babylonjs/core";
import SceneComponent from "babylonjs-hook"; // if you install 'babylonjs-hook' NPM.
import "../css/Modeling.css";
import HavokPhysics from "@babylonjs/havok";
import { useSelector, useDispatch } from "react-redux";
import { RootState, rootReducer } from "../redux/modules/reducer";
import { changeTextInput,askGpt } from "../redux/modules/actions";

export default () => {


  let initializedHavok;

  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });
  
  let box :Mesh ;
  let ground:Mesh;
  let box2:Mesh;
  
  
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
    var light = new HemisphericLight("light", new Vector3(0, 2, 0), scene);
  
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  
    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox("box", { size: 100 }, scene);
    // //ground= MeshBuilder.CreatePlane("ground",{size:10})  
    // // Move the box upward 1/2 its height
    box.position.y = 0;
    box.position.x= 0;
    box.position.z=0;
    box.checkCollisions = true;
  
    box2 = MeshBuilder.CreateBox("box2", { size: 30 }, scene);
    //ground= MeshBuilder.CreatePlane("ground",{size:10})  
    // Move the box upward 1/2 its height
    box2.position.y = 60;
    box2.position.x= 10;
    box2.position.z=10;
    box2.checkCollisions = true;
    //ground.checkCollisions = true;
    const gravity = new Vector3(0, -10, 0);
    
      const hk = await HavokPhysics();
      const babylonPlugin =  new HavokPlugin(true, hk);
      scene.enablePhysics(gravity, babylonPlugin);
    // Our built-in 'ground' shape.
    //MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  };

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
  



  // const getSpeech = (text) => {
  //   let voices = [];
  
  //   디바이스에 내장된 voice를 가져온다.
  //   const setVoiceList = () => {
  //     voices = window.speechSynthesis.getVoices();
  //   };
  
  //   setVoiceList();
  
  //   if (window.speechSynthesis.onvoiceschanged !== undefined) {
  //     voice list에 변경됐을때, voice를 다시 가져온다.
  //     window.speechSynthesis.onvoiceschanged = setVoiceList;
  //   }
  
  //   const speech = (txt) => {
  //     const lang = "ko-KR";
  //     const utterThis = new SpeechSynthesisUtterance(txt);
  
  //     utterThis.lang = lang;
  
  //     /* 한국어 vocie 찾기
  //        디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
  //     */
  //     const kor_voice = voices.find(
  //       (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
  //     );
  
  //     힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
  //     if (kor_voice) {
  //       utterThis.voice = kor_voice;
  //     } else {
  //       return;
  //     }
  
  //     utterance를 재생(speak)한다.
  //     window.speechSynthesis.speak(utterThis);
  //   };
  
  //   speech(text);
  // };



  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene:Scene) => {
    if (box !== undefined) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();
  
      const rpm = 10;
      //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
    if (box2 !== undefined) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();
      box2.actionManager=new ActionManager(scene)
  
      box2.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger,pickBox2)
      )
      const rpm = 10;
      //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  };


  return(
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
}
  

