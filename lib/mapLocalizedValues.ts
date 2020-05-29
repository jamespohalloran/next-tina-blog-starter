const stripLinkedData = (fieldValue: any) => {
  if ((fieldValue.sys?.contentType.sys.type || "") == "Link") {
    const { space, contentType, environment, ...sys } = fieldValue.sys;
    return { sys: { id: sys.id, type: "Link", linkType: "Entry" } };
  }
  return fieldValue;
};

export const mapLocalizedValues = (values: any, locale: string) => {
  const localizedValues: any = {};
  Object.keys(values).forEach(function (key, index) {
    const fieldValue = values[key];

    if (Array.isArray(fieldValue)) {
      // TODO - this should check on links, not array
      localizedValues[key] = {
        [locale]: fieldValue.map((val) => {
          return stripLinkedData(val);
        }),
      };
    } else {
      localizedValues[key] = { [locale]: stripLinkedData(fieldValue) };
    }
  });
  return localizedValues;
};

export const getLocaleValues = (localizedValues: any, locale: string) => {
  const values: any = {};
  Object.keys(localizedValues).forEach(function (key) {
    values[key] = localizedValues[key][locale];
  });
  return values;
};