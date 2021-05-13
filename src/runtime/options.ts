const tagMap: {[tagName: string]: string} = {};

export const setTransformedTagName = (tagName: string, transformedTagName: string) => {
  tagMap[tagName] = transformedTagName;
}

export const getTagName = (tagName: string) => {
  return tagMap[tagName] || tagName
}

export const getCustomTags = () => {
  return Object.keys(tagMap);
}