// Вспомогательная математика для 3x3 и PRNG

export const EPS = 1e-9
export const near = (a,b,eps=EPS) => Number.isFinite(+a) && Math.abs(+a - +b) <= eps

export function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const randint = (rng, a, b) => a + Math.floor(rng() * (b - a + 1))
export const choice  = (rng, arr) => arr[Math.floor(rng() * arr.length)]

// 3x3 helpers
export const det3 = (A) => {
  const [a,b,c] = A[0], [d,e,f] = A[1], [g,h,i] = A[2]
  return a*e*i + b*f*g + c*d*h - c*e*g - b*d*i - a*f*h
}
export const minor3 = (A, r, c) => {
  const m = []
  for (let i=0;i<3;i++){
    if (i===r) continue
    const row=[]
    for (let j=0;j<3;j++){
      if (j===c) continue
      row.push(A[i][j])
    }
    m.push(row)
  }
  // det 2x2
  return m[0][0]*m[1][1] - m[0][1]*m[1][0]
}
export const cofactor = (A, r, c) => ((r+c)%2===0?+1:-1)*minor3(A, r, c)

export const adjugate = (A) => {
  const C = Array.from({length:3},()=>Array(3).fill(0))
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) C[i][j] = cofactor(A, i, j)
  // adj(A) = C^T
  const Adj = Array.from({length:3},()=>Array(3).fill(0))
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) Adj[i][j] = C[j][i]
  return Adj
}
export const matMul = (A,B) => {
  const n=3,m=3,k=3
  const R = Array.from({length:n},()=>Array(k).fill(0))
  for (let i=0;i<n;i++){
    for (let j=0;j<k;j++){
      let s=0
      for (let t=0;t<m;t++) s += A[i][t]*B[t][j]
      R[i][j]=s
    }
  }
  return R
}
export const matEq = (A,B) => {
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (!near(A[i][j],B[i][j])) return false
  return true
}
export const matEye = () => [[1,0,0],[0,1,0],[0,0,1]]
export const vecEq = (x,y) => x.every((v,i)=> near(v,y[i]))
export const matVec = (A,x) => {
  const r = [0,0,0]
  for (let i=0;i<3;i++){
    let s=0
    for (let j=0;j<3;j++) s+=A[i][j]*x[j]
    r[i]=s
  }
  return r
}
export const inv3 = (A) => {
  const d = det3(A)
  if (Math.abs(d) < EPS) return null
  const Adj = adjugate(A)
  const inv = Array.from({length:3},()=>Array(3).fill(0))
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) inv[i][j] = Adj[i][j] / d
  return inv
}

// latex helpers
export const latexMatrix = (A, name='A') =>
  `${name} = \\begin{pmatrix}
${A[0][0]} & ${A[0][1]} & ${A[0][2]} \\\\
${A[1][0]} & ${A[1][1]} & ${A[1][2]} \\\\
${A[2][0]} & ${A[2][1]} & ${A[2][2]}
\\end{pmatrix}`
export const latexVec = (x, name='x') =>
  `${name} = \\begin{pmatrix} ${x[0]} \\\\ ${x[1]} \\\\ ${x[2]} \\end{pmatrix}`
