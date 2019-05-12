// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag'

export const getProperty = gql`query GetProperty($id: ID!) {
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
  }
}
`;
export const listPropertys = gql`query ListPropertys(
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
    }
    nextToken
  }
}
`;
