// eslint-disable
// this is an auto generated file. This will be overwritten

export const getProperty = `query GetProperty($id: ID!) {
  getProperty(id: $id) {
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
export const listPropertys = `query ListPropertys(
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  listPropertys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPicture = `query GetPicture($id: ID!) {
  getPicture(id: $id) {
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
export const listPictures = `query ListPictures(
  $filter: ModelPictureFilterInput
  $limit: Int
  $nextToken: String
) {
  listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      file {
        bucket
        region
        key
      }
      createdAt
    }
    nextToken
  }
}
`;
