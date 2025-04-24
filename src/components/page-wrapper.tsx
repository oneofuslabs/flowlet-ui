import { cn } from "@/lib/utils";
import { useTitle } from "@/context/title.context";
import { useEffect } from "react";

export const PageWrapper = ({
  children,
  className,
  noPadding,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  title?: string;
}) => {
  const { updateTitle } = useTitle();
  useEffect(() => {
    updateTitle(title);
  }, [title, updateTitle]);

  return (
    <div className={cn("flex flex-col ", noPadding ? "" : "px-4", className)}>
      {children}
    </div>
  );
};
