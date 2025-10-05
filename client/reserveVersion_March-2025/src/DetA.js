import React, {useState} from "react";

function DetA(matrixA) {   
    let det =0
    if (matrixA.length===2){
        return det=matrixA[0][0]*matrixA[1][1]-matrixA[0][1]*matrixA[1][0]
    } else  { 
        det+=matrixA[0][0]*matrixA[1][1]*matrixA[2][2]
        det+=matrixA[0][1]*matrixA[1][2]*matrixA[2][0]+matrixA[1][0]*matrixA[2][1]*matrixA[0][2]
        det-=matrixA[0][2]*matrixA[1][1]*matrixA[2][0]+matrixA[0][1]*matrixA[1][0]*matrixA[2][2]
        det-=matrixA[1][2]*matrixA[2][1]*matrixA[0][0]
        return det 
    }

    
    // return (
    //     matrixA[0][0]*matrixA[1][1]-matrixA[0][1]*matrixA[1][0]
    // ) 
}

export default DetA