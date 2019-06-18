const ObjectToImage = ((array)) => {
  const blob = new Blob(array, {type: this.featuredImage.Metadata.type})
  this.featuredImage = new File([blob], this.featuredImage.Metadata.name, {type:this.featuredImage.Metadata.type});
}


export ObjectToImage