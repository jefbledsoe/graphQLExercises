var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    // Your code goes here
    let id = arg.id;
    return restaurants.filter((restaurant) => {
      return restaurant.id == id;
    })[0];
  },
  restaurants: () => {
    // Your code goes here
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    restaurants.push({
      id: restaurants.length + 1,
      name: input.name,
      description: input.description,
    });
    return input;
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    let idToDelete = id;
    restaurants = restaurants.filter((restaurant) => {
      return restaurant.id != idToDelete;
    });
    return { ok: true };
  },
  editrestaurant: ({ id, argsTOEdit}) => {
    // Your code goes here
    let {name,description} = argsTOEdit;
    let restaurantToEdit = restaurants.filter((r) => {
      return r.id == id;
    }
    )[0];
    restaurantToEdit.name = name;
    restaurantToEdit.description = description;
    return restaurantToEdit;

  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var PORT = 5500;
app.listen(PORT, () => console.log("Running Graphql on Port:" + PORT));

//export default root;
