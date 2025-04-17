import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  className,
  noPadding,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-screen",
        noPadding ? "" : "px-4",
        className
      )}
    >
      {children}
    </div>
  );
};
