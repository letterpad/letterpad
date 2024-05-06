import https from "https";
import sizeOf from "image-size";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) return new NextResponse("No url provided", { status: 400 });
  const actionToTry = () =>
    new Promise((resolve, reject) =>
      https.get(url, function (response) {
        const chunks: Uint8Array[] = [];
        response
          .on("data", function (chunk: Uint8Array) {
            chunks.push(chunk);
          })
          .on("end", async function () {
            const buffer = Buffer.concat(chunks);
            return resolve(sizeOf(buffer));
          })
          .on("error", function (err) {
            return reject(err);
          });
      })
    );

  const response = await actionToTry();
  return NextResponse.json(response, { status: 200 });
  //   return response as Promise<{ width: number; height: number; type: string }>;
}
