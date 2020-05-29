const Banner = {
  label: "Banner",
  //@ts-ignore
  itemProps: (item) => ({
    key: item.id,
    label: `${item.fields.title?.slice(0, 15)}...` || "Unnamed Block",
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

export default Banner;
