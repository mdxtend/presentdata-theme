import { type FieldDefs } from '@contentlayer/source-files'

type PageType = {
  name: string;
  path: string;
  fields: FieldDefs;
}

export interface Page {
  title: string;
  slug: string;
  icon: string;
  layout: string;
  sections: any[];
  contentType?: PageType;
}
