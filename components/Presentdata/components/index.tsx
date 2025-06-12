import React, { ReactNode } from 'react';
import { icons, LucideProps } from 'lucide-react';

// TYPES
export interface MdxReactType {
  children?: ReactNode;
}

// UTILITY
import Button from './utility/Button';
import ToolTip from './utility/ToolTip';
import Badge from './utility/Badge';

// DATA
import Group, { Tab } from './data/Group';
import Code from './data/Code';
import QuoteCard from './data/QuoteCard';
import Accordion from './data/Accordion';
import { DropCap } from './data/DropCap';

// VIEWER
import PDFViewer from './viewer/viewers/PDFViewer';
import ImageViewer from './viewer/viewers/ImageViewer';

// HTML
import {
  a,
  blockquote,
  code,
  Image,
  Image2,
  ImageSvg,
  pre,
  table,
} from './html/tags';

// Lucide Icons wrapper
export const Lucide = ({
  name,
  ...props
}: { name: keyof typeof icons } & LucideProps) => {
  const Icon = icons[name];
  return Icon ? <Icon {...props} /> : null;
};

export const mdxComponents = {
  DropCap,
  Image,
  Image2,
  ImageSvg,
  a,
  pre,
  blockquote,
  code,
  table,
  ImageViewer,
  PDFViewer,
  Tab,
  Code,
  Group,
  QuoteCard,
  Accordion,
  Button,
  ToolTip,
  Badge,
  Lucide,
};
