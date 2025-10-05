// import React, {useState} from "react";
import FScore from "./FScore";
 
function Checkit(stuv,corv,indctr) {  
    var Score=0
    let max=25
    let eps=0.0001
    
    // console.log("corv for",indctr,"=", corv)

        if (Math.abs(stuv-corv)<eps){
            Score=FScore(indctr,max);
        } else {
            Score=0;
            
        }
    
        // console.log("score for",indctr, Score)
        return Score
}

export default Checkit