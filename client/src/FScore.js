import React, {useState} from "react";

function FScore(indctr,max) {  
    let prcntg=40, score=0;

    prcntg=(indctr==="det") ? 40 :10
    score=score+max*prcntg/100

    return score
}

export default FScore



