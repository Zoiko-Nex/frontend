import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const kycPath = "C:\\Users\\aparaziitha nitta\\backend\\kyc_logs.txt";
    const ratingPath = "C:\\Users\\aparaziitha nitta\\backend\\rating_logs.txt";

    let logs: string[] = [];

    if (fs.existsSync(kycPath)) {
      // Read with support for UTF-16LE or UTF-8 fallback
      let rawData = fs.readFileSync(kycPath);
      let data = "";
      if (rawData[0] === 0xff && rawData[1] === 0xfe) {
        data = rawData.toString("utf16le");
      } else {
        data = rawData.toString("utf8");
      }

      const lines = data.split(/\r?\n/).filter(Boolean);
      logs.push(...lines.map(l => `[KYC] ${l}`));
    }
    if (fs.existsSync(ratingPath)) {
      let rawData = fs.readFileSync(ratingPath);
      let data = "";
      if (rawData[0] === 0xff && rawData[1] === 0xfe) {
        data = rawData.toString("utf16le");
      } else {
        data = rawData.toString("utf8");
      }

      const lines = data.split(/\r?\n/).filter(Boolean);
      logs.push(...lines.map(l => `[RATING] ${l}`));
    }

    // Return the latest 20 log messages
    const latestLogs = logs.slice(-20).reverse();
    return NextResponse.json(latestLogs);
  } catch (err) {
    return NextResponse.json(["[LOGS ERROR] " + String(err)], { status: 500 });
  }
}
