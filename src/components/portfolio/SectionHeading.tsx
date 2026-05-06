type Props = {
  title: string;
  subtitle?: string;
  id?: string;
};

export function SectionHeading({ title, subtitle, id }: Props) {
  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
