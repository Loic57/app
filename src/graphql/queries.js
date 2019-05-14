// eslint-disable
// this is an auto generated file. This will be overwritten

export const getProperty = `query GetProperty($id: ID!) {
  getProperty(id: $id) {
    id
    title
    category
    price
    bedrooms
    bathrooms
    area
    status
    rooms
    garages
    parkings
    location
    exact_location
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
      title
      category
      price
      bedrooms
      bathrooms
      area
      status
      rooms
      garages
      parkings
      location
      exact_location
    }
    nextToken
  }
}
`;
