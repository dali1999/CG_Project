import { ActionType } from "./types"


const changeTextInput=()=>{
    return{
        type:ActionType.TEXT_INPUT,

    }
}

const askGpt=(payload:string)=>{
    return{
        type:ActionType.POST_GPT,
        payload
    }
}

const askGptSuccess=(payload:string)=>{
    return{
        type:ActionType.POST_GPT_SUCCESS,
        payload
    }
}

type ActionObject=
|ReturnType<typeof changeTextInput>
|ReturnType<typeof askGpt>
|ReturnType<typeof askGptSuccess>

export {changeTextInput,askGpt}
export type{ActionObject}