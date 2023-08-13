import type { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth].js";
import { prisma } from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // const session = await getServerSession(req, res, authOptions);
    // if (!session) {
    //   return res
    //     .status(401)
    //     .json({ message: "Please sign in to create a post." });
    // }

    const description: string = req.body.description;
    const valueAsNumber: number = Number(req.body.value);
    const situation: string = req.body.situation;
    const type: boolean = req.body.type;

    //Get User
    // const prismaUser = await prisma.user.findUnique({
    //   where: { email: session?.user?.email! },
    // });
    //Check for empty

    if (!description.length) {
      return res.status(403).json({ message: "Please do not leave it empty." });
    }
    if (valueAsNumber == 0) {
      return res.status(403).json({ message: "Please do not leave it empty." });
    }
    if (!situation.length) {
      return res.status(403).json({ message: "Please do not leave it empty." });
    }

    //Create Post
    try {
      const result = await prisma.expensesAndEarnings.create({
        data: {
          description,
          value: valueAsNumber,
          situation,
          type,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res
        .status(403)
        .json({
          err: "Error has occured while creating an expense or earning.",
        });
    }
  }
}
