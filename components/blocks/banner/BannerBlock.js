const Banner = {
  label: "Banner",
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
      name: "fields.title",
      component: "text",
    },
    {
      label: "Subtitle",
      name: "fields.subtitle",
      component: "textarea",
    },
    {
      label: "Button Text",
      name: "fields.buttonText",
      component: "text",
    },
  ],
};

export default Banner;
