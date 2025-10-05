import React, {useState} from "react";

function Minor(minor,k,b,rows) {  
    console.log("k=", k)
    console.log("minor00=", minor[0][0],"minor01=", minor[0][1])
    console.log("minor10=", minor[1][0],"minor11=", minor[1][1])

    // let Minor = Array(rows)
    // new Array(clms).fill(0)

    for (let i = 0; i < rows; i++) {
      Minor[i] = minor[i]
    } 
    for (let i = 0; i < rows; i++) {
        Minor[i][k]=b[i]
    } 
    
    return Minor
}

export default Minor

