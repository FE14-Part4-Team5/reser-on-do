/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace daum {
  interface PostcodeAddressData {
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
  }

  interface PostcodeOptions {
    oncomplete: (data: PostcodeAddressData) => void;
    width?: string | number;
    height?: string | number;
    top?: number;
    left?: number;
  }

  class Postcode {
    constructor(options: PostcodeOptions);
    embed(container: HTMLElement): void;
  }
}

declare global {
  interface Window {
    daum: typeof daum;
  }
}

export {};
