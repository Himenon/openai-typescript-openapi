import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import * as rimraf from "rimraf";
import { outputDir, versions } from "./config";

export const getOpenAIOpenApiSchema = async (version: string): Promise<any> => {
  const url = `https://github.com/openai/openai-openapi/raw/${version}/openapi.yaml`;
  try {
    console.log(`Fetch Url: ${url}`);
    const res = await fetch(url);
    return res.text();
  } catch (error) {
    throw error as any;
  }
};

const main = async () => {
  const tempDir = `.tmp-${outputDir}`;
  fs.mkdirSync(tempDir, { recursive: true });
  rimraf.sync(outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const tasks = versions.map(async (version) => {
    const result = await getOpenAIOpenApiSchema(version);
    const openapiFilename = path.join(outputDir, `openapi-${version}.yaml`);
    fs.writeFileSync(openapiFilename, result, {
      encoding: "utf-8",
    });
  });
  await Promise.all(tasks);
  rimraf.sync(tempDir);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
