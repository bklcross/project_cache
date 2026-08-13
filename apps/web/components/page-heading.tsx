export function PageHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="mb-7">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="metric mt-2 text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed muted sm:text-base">{detail}</p>
    </div>
  );
}
