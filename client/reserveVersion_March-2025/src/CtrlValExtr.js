k // sqrt(c/2)=k
c, z,
der1=2*z-c/z; // 1st derivative y'(z)
criPnum=3; // number of critical points
diPn=1; // number of discontinuity points
sPn=2; // number of stationary points
stDisP // DiscontinuityPoint=0;
stIndef2 // y''(discontinuity point ="не существует" // 
stp_ref[0]=Math.sqrt(c/2); i=0,1 // stationary points
stp_ref[1]= -Math.sqrt(c/2); i=0,1 // stationary points

der2st_ref[i]=2+c/(Math.pow(stStp[i],2))=4;    i=0,stSpN


  const saveCalc = async (k, c,z, der1, stp_ref, taskNumber) => {
      try {
        const docRef = await addDoc(collection(db, '0_extrCalc'), { //thepeng
        z: 'y=x^2-cln x',
        zz: "criP=3, diPn=1, sPn=2",
        zzz: " DiscontinuityPoint=0, stIndef2=notexist, der2st=[4 4]",
          taskNumber: taskNumber,
          der1atz: der1,    
          stationaryPoints: stp_ref
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    React.useEffect(() => {
      saveCalc(k, c,z, der1, stp_ref, taskNumber)
    }, [mssg])

