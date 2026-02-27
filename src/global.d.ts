declare const __DEV__: boolean

declare module '*.svg' {
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare module 'react:/src/icons/*.svg' {
  import React from 'react'
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>
  export default SVG
}
