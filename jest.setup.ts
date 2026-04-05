import "@testing-library/jest-dom"
import { ReadableStream } from "stream/web"
import { TextDecoder, TextEncoder } from "util"

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
})

const { fetch, Headers, Request, Response } = require("next/dist/compiled/@edge-runtime/primitives/fetch")

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
})

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
}))
