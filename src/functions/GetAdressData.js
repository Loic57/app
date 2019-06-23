const GetAddressData = ((addressData, placeResultData, id)  => {
  this.address = addressData;
  this.location = this.address.locality;
});

export { GetAddressData }