const Banner = {
  label: "Banner",
  //@ts-ignore
  itemProps: (item) => {
    console.log(`itemProps:`, item);
    return {
      key: item.id,
      label: `${item.fields.title.slice(0, 15)}...`,
    };
  },
  defaultItem: {
    title: "Here is a title",
    subtitle: "This is a description",
    buttonText: "Click me!",
  },
  fields: [],
};

export default Banner;
