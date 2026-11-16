import { Story as StoryBlock, type StoryProps } from "@storybook/addon-docs/blocks";

type ComponentCatalogRowProps = {
  name: string;
  description: string;
  href: string;
  story: NonNullable<StoryProps["of"]>;
};

/** Documentation layout for a live package story and its manual link. */
export function ComponentCatalogRow({ name, description, href, story }: Readonly<ComponentCatalogRowProps>) {
  return (
    <section className="grid grid-cols-1 gap-between-groups border-b border-border py-between-groups md:grid-cols-2">
      <div className="flex flex-col gap-in-group">
        <h3 className="text-base font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <a className="text-sm underline" href={href}>Read the manual</a>
      </div>
      <div className="min-w-0"><StoryBlock of={story} /></div>
    </section>
  );
}
