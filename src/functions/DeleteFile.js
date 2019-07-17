const deleteFile = (file) => {
  for(let i=0;i<this.filesArray.length;i++) {
    if(this.filesArray[i][1] === file) {
      if(this.indexFeatured === file) {
        this.indexFeatured = -1;
      }
      this.filesArray.splice(i, 1);
      this.filesToDeleteFromServer.push(this.filesArrayNames[i]);
    }
  }
}

export {deleteFile}