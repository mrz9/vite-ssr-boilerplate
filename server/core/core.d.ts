declare namespace Express {
    type TmessageOrOptions =
        | 'string'
        | {
              code: number
              msg: string
          }
    interface Application {
        root: string
        __dirname: string
        __filename: string
    }
    interface Response {
        error: (messageOrOptions: TmessageOrOptions) => void
        success: (data: any, code: number) => void
    }
}
