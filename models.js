const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the Pokemon Schema
const PokemonSchema = new Schema({
  pokemonName: { type: String, required: true },
  pokemonAbility: { type: String, required: true },
  initialPositionX: { type: Number, required: false },
  initialPositionY: { type: Number, required: false },
  speed: { type: Number, required: false },
  direction: { type: String, required: false },
});

// Define the Trainer Schema
const TrainerSchema = new Schema({
  pokemonOwnerName: { type: String, required: true, unique: true },
  pokemons: [PokemonSchema],
});

// Create Models
const Pokemon = mongoose.model('Pokemon', PokemonSchema);
const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = { Pokemon, Trainer };
