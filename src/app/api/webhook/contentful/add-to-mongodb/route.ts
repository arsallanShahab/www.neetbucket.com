import client from "@/lib/contentful";
import { connectToDatabase } from "@/lib/mongodb";
import { SoftCopyChapter } from "@/lib/types";
import { NextResponse } from "next/server";

export interface IMongoDBChapter {
  contentfulId: string;
  title: string;
  subject: string;
  class: string;
  price: number;
  thumbnail: {
    url: string;
    fileName: string;
    size: number;
  };
  fullPdf: {
    url: string;
    fileName: string;
    size: number;
  };
}

export async function GET() {
  try {
    const getAllChapters = await client.getEntries({
      content_type: "productDemo",
    });
    const chapters = getAllChapters.items as unknown as SoftCopyChapter[];
    const filteredChapters: IMongoDBChapter[] = chapters.map(
      (chapter: SoftCopyChapter) => {
        const fullPdf = chapter?.fields?.fullPdf;
        return {
          contentfulId: chapter.sys.id,
          title: chapter.fields.chapterName,
          subject: chapter.fields.subject.fields.subjectName,
          class: chapter.fields.class,
          price: chapter.fields.price,
          thumbnail: {
            url: chapter.fields.chapterThumbnail.fields.file.url,
            fileName: chapter.fields.chapterThumbnail.fields.file.fileName,
            size: chapter.fields.chapterThumbnail.fields.file.details.size,
          },
          fullPdf: {
            url: fullPdf?.fields?.pdf?.fields?.file?.url || "",
            fileName: fullPdf?.fields?.pdf?.fields?.file?.fileName || "",
            size: fullPdf?.fields?.pdf?.fields?.file?.details?.size || 0,
          },
        };
      },
    );

    const { db, client: mongoDbClient } = await connectToDatabase();
    const chaptersCollection = db.collection("chapters");
    const deletePreviousChapters = await chaptersCollection.deleteMany({});
    const insertChapters =
      await chaptersCollection.insertMany(filteredChapters);

    // const prodDB = mongoDbClient.db("prod");
    // const chaptersCollection = prodDB.collection("chapters");
    // const insertChapters =
    //   await chaptersCollection.insertMany(filteredChapters);

    if (!insertChapters) {
      return NextResponse.json(
        { error: "Failed to insert chapters" },
        { status: 500 },
      );
    }

    return NextResponse.json({ chapters: filteredChapters }, { status: 200 });
  } catch (error) {
    const err = error as Error & { message: string };
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
