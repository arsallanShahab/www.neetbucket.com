import { EntrySkeletonType } from "contentful";

export interface HardCopyEntry extends EntrySkeletonType {
  metadata: {
    tags: [];
  };
  sys: {
    space: {
      sys: {
        type: "Link";
        linkType: "Space";
        id: string;
      };
    };
    id: string;
    type: "Entry";
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: "Link";
        linkType: "Environment";
      };
    };
    revision: number;
    contentType: {
      sys: {
        type: "Link";
        linkType: "ContentType";
        id: string;
      };
    };
    locale: string;
  };
  fields: {
    heading: string;
    chapterThumbnail: {
      metadata: {
        tags: [];
      };
      sys: {
        space: {
          sys: {
            type: "Link";
            linkType: "Space";
            id: string;
          };
        };
        id: string;
        type: "Asset";
        createdAt: string;
        updatedAt: string;
        environment: {
          sys: {
            id: string;
            type: "Link";
            linkType: "Environment";
          };
        };
        revision: number;
        locale: string;
      };
      fields: {
        title: string;
        description: string;
        file: {
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
        };
      };
    };
    price: number;
    demoImages: ContentfulImage[];
  };
}

interface ContentfulImage {
  metadata: {
    tags: [];
  };
  sys: {
    space: {
      sys: {
        type: "Link";
        linkType: "Space";
        id: string;
      };
    };
    id: string;
    type: "Asset";
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: "Link";
        linkType: "Environment";
      };
    };
    revision: number;
    locale: string;
  };
  fields: {
    title: string;
    description: string;
    file: {
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
    };
  };
}
