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

type ActionObject=
|ReturnType<typeof changeTextInput>
|ReturnType<typeof askGpt>

export {changeTextInput,askGpt}
export type{ActionObject}