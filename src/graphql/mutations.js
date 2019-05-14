// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag'

export const createProperty = gql`mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
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
export const updateProperty = gql`mutation UpdateProperty($input: UpdatePropertyInput!) {
  updateProperty(input: $input) {
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
export const deleteProperty = `mutation DeleteProperty($input: DeletePropertyInput!) {
  deleteProperty(input: $input) {
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
