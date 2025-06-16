declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_KEY: string
    }
  }
}

export {};