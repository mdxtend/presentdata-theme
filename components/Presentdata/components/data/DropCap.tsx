import { MdxReactType } from "..";

export const DropCap = ({ children, ...props }: MdxReactType) => (
    <div className="first-letter:text-3xl max-sm:first-letter:text-5xl" {...props}>
        {children}
    </div>
)