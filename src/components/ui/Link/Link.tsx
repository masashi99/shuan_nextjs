import LinkComponent from "next/link";
import { type ReactNode, forwardRef } from "react";

export type LinkProps = {
  href: string;
  children: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <LinkComponent {...props} ref={ref} />;
});
