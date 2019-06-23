const ObjectToImage = ((array, name, type) => {
  const blob = new Blob(array, {type: type})
  const image = new File([blob], name, {type: type});

  return image;
});

export { ObjectToImage }