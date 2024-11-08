import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context=createContext();

const ContextProvider=(props) => {

    //save the input of user
    const [input,setInput]=useState("");
    //after sending user input - prompt is store in recentPrompt.  
    const [recentPrompt,setRecentPrompt]=useState("");
    //for history of prompt - in side bar
    const [prevPrompts,setPrevPrompts]=useState([]);
    //true hua to result show krega cards ko hta kr main page pr
    const [showResult,setShowResult]=useState(false);
    //loading if true and display data when it is false
    const [loading,setLoading]=useState(false);
    //store result of prompt and display it
    const[resultData,setResultData]=useState("");


    // Function is for typing effect - write character one by one not a full para at once
    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev => prev+nextWord);
        },75*index)
    }

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }
    const onSent=async (prompt)=>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt!==undefined){
            response=await run(prompt);
            setRecentPrompt(prompt);

        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response=await run(input)
        }
            
        let responseArray=response.split("**");
        let newResponse="";
        // Bold the heading
        for(let i=0;i < responseArray.length ; i++){
            if(i === 0 || i%2 !==1) {
                newResponse += responseArray[i];
            }else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        // Line breaks for paragraph
        let newResponse2 = newResponse.split("*").join("</br>")

        // Write character bycahracter
        let newResponseArray=newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i , nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }


    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider