// eslint-disable
// this is an auto generated file. This will be overwritten

import gql from "graphql-tag"

export const createProperty = gql`mutation CreateProperty($input: CreatePropertyInput!) {
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
export const updateProperty = gql`mutation UpdateProperty($input: UpdatePropertyInput!) {
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
export const deleteProperty = gql`mutation DeleteProperty($input: DeletePropertyInput!) {
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
