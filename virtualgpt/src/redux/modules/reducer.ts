import { ActionType } from "./types"
import { combineReducers } from 'redux';
import { ActionObject } from "./actions";
import produce from "immer";

type textInputType={
    toggle:boolean
}
export type gptAskType={
    type:string
    payload:string
}

const textInputState:textInputType={
    toggle:false
}
const gptAskState:gptAskType={
    type:'',
    payload:''
}


const textInputReducer =(state:textInputType=textInputState,action:ActionObject) =>{
    switch(action.type){
        case ActionType.TEXT_INPUT:
            if (state.toggle){
                return{
                    toggle:false
                }
            }
            else{
                return{
                    toggle:true
                }
            }

       default:
         return state;  
      }
    };  
const gptAskReducer =(state:gptAskType=gptAskState,action:ActionObject) =>{
    const tmp:any=action

    switch(action.type){
        case ActionType.POST_GPT:
            return{
                type:ActionType.POST_GPT,
                payload:state.payload
            }
        case ActionType.POST_GPT_SUCCESS:
            console.log(state)
            console.log(action)
            return{
                type:ActionType.POST_GPT_SUCCESS,
                payload:tmp.choices[0].message.content
            }    
        case ActionType.POST_GPT_FAIL:
            return{
                answer:'fail'
            }   
        default:
            return state;  
        }
    };      

const rootReducer=combineReducers({
    textInputReducer,
    gptAskReducer
}) 

export type RootState=ReturnType<typeof rootReducer>

export{rootReducer}