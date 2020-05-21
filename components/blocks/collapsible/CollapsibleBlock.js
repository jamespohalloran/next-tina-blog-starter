const CollapsibleBlock = {
  label: "Collapsible",
  //@ts-ignore
  itemProps: (item) => ({
    key: item.id,
    label: `${item.title.slice(0, 15)}...`,
  }),
  defaultItem: {
    title: "Here is a title",
    subtitle: "This is a description",
    buttonText: "Click me!",
  },
  fields: [
    {
      label: "Title",
      name: "title",
      component: "text",
    },
    {
      label: "Subtitle",
      name: "subtitle",
      component: "textarea",
    },
    {
      label: "Button Text",
      name: "buttonText",
      component: "text",
    },
  ],
};

export default CollapsibleBlock;
