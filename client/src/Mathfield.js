import * as React from "react";

import { useEffect, useMemo } from "react";
import { MathfieldElement, MathfieldOptions } from "mathlive";

const Mathfield = () => {
  const mathfieldRef = React.useRef(null);

  React.useEffect(() => {
    // mathfieldRef.current.<option> = <value>;
  }, []);

  return <math-field ref={mathfieldRef} />;
};
export default Mathfield;
