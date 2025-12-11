declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

// Allow importing PNG/JPG/SVG directly if not already configured
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
