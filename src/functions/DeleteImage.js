const DeleteImage = index => {
  for(let i=0;i<this.filesArray.length;i++) {
    if(i == index) {
      this.filesArrayURL.splice(index, 1); //on supprime une seule entrée du tableau à partir de l'index
      this.filesArray.splice(index, 1);
    }
  }
};

export { DeleteImage }