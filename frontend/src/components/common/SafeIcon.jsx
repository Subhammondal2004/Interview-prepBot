import { cloneElement, isValidElement } from "react";

export function SafeIcon({
  icon,
  iconClassName = "h-5 w-5",
  emojiClassName = "text-lg",
  fallback = "📝",
}) {
  if (!icon) {
    return (
      <span className={emojiClassName} aria-hidden="true">
        {fallback}
      </span>
    );
  }

  // Emoji / plain string
  if (typeof icon === "string") {
    return (
      <span className={emojiClassName} aria-hidden="true">
        {icon}
      </span>
    );
  }

  // Already a JSX element (e.g. icon={<BookOpen />}), keep it safe + merge className
  if (isValidElement(icon)) {
    const existing = icon.props?.className ?? "";
    return cloneElement(icon, {
      className: [existing, iconClassName].filter(Boolean).join(" "),
      "aria-hidden": true,
    });
  }

  // Component reference (e.g. icon={BookOpen})
  const IconComp = icon;
  return <IconComp className={iconClassName} aria-hidden="true" />;
}

