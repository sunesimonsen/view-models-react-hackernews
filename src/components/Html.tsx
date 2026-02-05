import { memo } from "react";

interface HtmlProps {
  html: string;
}

export const Html = memo(({ html }: HtmlProps) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
});

Html.displayName = "Html";
