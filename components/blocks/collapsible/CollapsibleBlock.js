const CollapsibleBlock = {
  label: "Collapsible",
  //@ts-ignore
  itemProps: (item) => ({
    key: item.id,
    label: `${item.length ? title.slice(0, 15) : "Panels"}...`,
  }),
  defaultItem: {
    panels: [],
  },
  fields: [
    {
      label: "Panels",
      name: "panels",
      component: "group-list",
      defaultItem: () => ({
        title: "Here is a title",
        subtitle: "This is a description",
        tertiaryText: "20.50",
      }),
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
          label: "Tertiary Text",
          name: "tertiaryText",
          component: "text",
        },
      ],
    },
  ],
};

export default CollapsibleBlock;
