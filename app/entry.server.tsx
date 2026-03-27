import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import pkg from "react-dom/server";
const { renderToPipeableStream } = pkg;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const isBot = isbot(request.headers.get("user-agent") || "");

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady() {
          if (isBot) {
            const passThrough = new PassThrough();
            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(passThrough as unknown as ReadableStream, {
                headers: responseHeaders,
                status: didError ? 500 : responseStatusCode,
              })
            );
            pipe(passThrough);
          }
        },
        onShellReady() {
          if (!isBot) {
            const passThrough = new PassThrough();
            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(passThrough as unknown as ReadableStream, {
                headers: responseHeaders,
                status: didError ? 500 : responseStatusCode,
              })
            );
            pipe(passThrough);
          }
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );

    request.signal.addEventListener("abort", abort);
  });
}
