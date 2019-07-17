// eslint-disable
// this is an auto generated file. This will be overwritten

import gql from "graphql-tag"

export const getProperty = gql`query GetProperty($id: ID!) {
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
    files
    featuredProperty
    pebImage
    pebNumber
    pebLetter
    eSpec
    eTotale
    hidden
  }
}
`;
export const listPropertys = gql`query ListPropertys(
  $id: ID
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  listPropertys(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      files
      featuredProperty
      pebImage
      pebNumber
      pebLetter
      eSpec
      eTotale
      hidden
    }
    nextToken
  }
}
`;
export const propertyByDate = gql`query PropertyByDate(
  $creation_date: String
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  PropertyByDate(
    creation_date: $creation_date
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      files
      featuredProperty
      pebImage
      pebNumber
      pebLetter
      eSpec
      eTotale
      hidden
    }
    nextToken
  }
}
`;
export const propertyByPrice = gql`query PropertyByPrice(
  $price: Float
  $filter: ModelPropertyFilterInput
  $limit: Int
  $nextToken: String
) {
  PropertyByPrice(
    price: $price
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      files
      featuredProperty
      pebImage
      pebNumber
      pebLetter
      eSpec
      eTotale
      hidden
    }
    nextToken
  }
}
`;
