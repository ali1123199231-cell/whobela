"use client";

export function EditableText({
  value,
  onChange,
  editable,
  className,
  placeholder,
  as = "span",
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  editable: boolean;
  className?: string;
  placeholder?: string;
  as?: "span" | "h1" | "p";
  multiline?: boolean;
}) {
  if (!editable) {
    const Tag = as;
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  const sharedClassName = `${className ?? ""} block w-full rounded-lg border border-dashed border-rose-400/60 bg-white/50 px-2 py-1 text-center outline-none focus:border-rose-500 focus:bg-white`;

  if (multiline) {
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className={sharedClassName}
      />
    );
  }

  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={sharedClassName}
    />
  );
}
