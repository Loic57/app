// eslint-disable
// this is an auto generated file. This will be overwritten

export const createProperty = `mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
    id
    area
    exact_location
    location
    price
    status
    title
    bathroom
    bedroom
    garage
    parking
    reference
    room
    type
    creation_date
  }
}
`;
export const updateProperty = `mutation UpdateProperty($input: UpdatePropertyInput!) {
  updateProperty(input: $input) {
    id
    area
    exact_location
    location
    price
    status
    title
    bathroom
    bedroom
    garage
    parking
    reference
    room
    type
    creation_date
  }
}
`;
export const deleteProperty = `mutation DeleteProperty($input: DeletePropertyInput!) {
  deleteProperty(input: $input) {
    id
    area
    exact_location
    location
    price
    status
    title
    bathroom
    bedroom
    garage
    parking
    reference
    room
    type
    creation_date
  }
}
`;
export const createPicture = `mutation CreatePicture($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    name
    file {
      bucket
      region
      key
    }
    createdAt
  }
}
`;
export const updatePicture = `mutation UpdatePicture($input: UpdatePictureInput!) {
  updatePicture(input: $input) {
    id
    name
    file {
      bucket
      region
      key
    }
    createdAt
  }
}
`;
export const deletePicture = `mutation DeletePicture($input: DeletePictureInput!) {
  deletePicture(input: $input) {
    id
    name
    file {
      bucket
      region
      key
    }
    createdAt
  }
}
`;
