import Group, { GroupProps } from './PdataComponents/data/Group';
import { CheckIcon, CopyIcon, TextUnWrapIcon, TextWrapIcon } from './Icons';
import Code, { CodeProps, Tab, TabProps } from './PdataComponents/data/Code';
import React, { useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import PDFViewer, { PDFViewerProps } from './PdataComponents/viewer/viewers/PDFViewer';
import ImageViewer, { ImageViewerProps } from './PdataComponents/viewer/viewers/ImageViewer';
import QuoteCard, { QuoteCardProps } from './PdataComponents/data/QuoteCard';
import Accordion, { AccordionProps } from './PdataComponents/data/Accordion';
import Button, { ButtonProps } from './PdataComponents/utility/Button';
import ToolTip, { ToolTipProps } from './PdataComponents/utility/ToolTip';
import Badge, { BadgeProps } from './PdataComponents/utility/Badge';
import * as Icon from 'lucide-react';
import type { LucideIcon } from 'lucide-react'
import { a, blockquote, code, Image, Image2, ImageSvg, pre, table } from './PdataComponents/html/tags';
import { DropCap } from './PdataComponents/data/DropCap';

export interface MdxReactType {
    children?: ReactNode;
}

// type MDXComponents = {
//     /** 
//      * INCLUDE NEW CUSTOM COMPONENT TYPES HERE BEFOER DEFINING
//      */
    
// };

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
    Icon
    /**
     * NEW CUSTOM FUNTION
     * 
        FunctionName: (props) => (
        <>
            // Function Logic //
        </>
        ),
     */
}