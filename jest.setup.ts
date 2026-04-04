import "@testing-library/jest-dom"
import { ReadableStream } from "stream/web"
import { TextDecoder, TextEncoder } from "util"

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
})
