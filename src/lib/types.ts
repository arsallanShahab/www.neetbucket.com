import { EntrySkeletonType } from "contentful";

interface Sys {
  space: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: string;
      linkType: string;
    };
  };
  revision: number;
  contentType: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  locale: string;
}

interface File {
  url: string;
  details: {
    size: number;
    image: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

interface Fields {
  title: string;
  description: string;
  file: File;
}

interface SubjectFields {
  subjectName: string;
  teacherName: string;
  iconName: string;
  slug: string;
  teacherImage: ContentfulEntryImage;
}

export interface Subject extends EntrySkeletonType {
  metadata: {
    tags: string[];
  };
  sys: Sys;
  fields: SubjectFields;
}

interface Metadata {
  tags: [];
}

interface File {
  url: string;
  details: {
    size: number;
    image: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

interface FieldsImage {
  title: string;
  description: string;
  file: File;
}

interface ContentfulEntryImage {
  metadata: Metadata;
  sys: Sys;
  fields: FieldsImage;
}

interface SubjectFields {
  subjectName: string;
  teacherName: string;
  iconName: string;
  slug: string;
  teacherImage: ContentfulEntryImage;
}

interface ContentfulEntryFields {
  chapterName: string;
  subject: Subject;
  class: string;
  chapterThumbnail: ContentfulEntryImage;
  price: number;
  demoImages: ContentfulEntryImage[];
  keyPoints: string[];
  fullPdf?: {
    fields: {
      pdf: {
        fields: {
          file: File;
        };
      };
    };
  };
}

export interface SoftCopyChapter extends EntrySkeletonType {
  metadata: Metadata;
  sys: Sys;
  fields: ContentfulEntryFields;
}
