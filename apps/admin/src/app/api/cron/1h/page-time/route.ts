import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const twentyMinutesAgo = new Date(Date.now() - (20 * 60 * 1000)).toISOString()
  const logs = await prisma.pageTimeLog.findMany({
    select: {
      updatedAt: true,
      snapshot: true,
      page_time: true,
      id: true
    },
    where: {
      page_time: 0,
      updatedAt: {
        lt: twentyMinutesAgo
      }
    }
  });

  for (const log of logs) {
    const page_time = sum(removeNoise(log.snapshot.split(",").map(Number).filter(Boolean))) / 60000;
    await prisma.pageTimeLog.update({
      where: {
        id: log.id
      },
      data: {
        page_time
      }
    });
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  return NextResponse.json({ success: true });
}




function removeNoise(numbers: number[]) {
  // Calculate the median
  numbers.sort((a, b) => a - b);
  const median = numbers[Math.floor(numbers.length / 2)];

  // Calculate the interquartile range (IQR)
  const q1 = numbers[Math.floor(numbers.length * 0.25)];
  const q3 = numbers[Math.floor(numbers.length * 0.75)];
  const iqr = q3 - q1;

  // Define a threshold for outliers
  const threshold = 1.5 * iqr;

  // Filter out values outside the threshold
  return numbers.filter(item => Math.abs(Number(item) - median) <= threshold);
}

function sum(arr: number[]) {
  return Number((arr.reduce((a, b) => a + b, 0)).toFixed(0));
}
