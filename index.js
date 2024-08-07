const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Pokemon, Trainer } = require('./models'); // Importing both models

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://pokeuser:test1234@cluster0.x4btp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection error: ${err}`);
});

// API Endpoints
app.get('/api/users', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/users', async (req, res) => {
    const { pokemonOwnerName, pokemons: pokemon } = req.body;
  
    console.log("pokemon is ", pokemon);
  
    try {
      let trainer = await Trainer.findOne({ pokemonOwnerName });
  
      if (!trainer) {
        trainer = new Trainer({ pokemonOwnerName, pokemons: [pokemon] });
        await trainer.save();
      } else {
        // Check for duplicate Pokemon name
        const duplicatePokemon = trainer.pokemons.find(p => p.pokemonName === pokemon.pokemonName);
        
        if (duplicatePokemon) {
          return res.status(400).json({ message: 'Pokemon with the same name already exists for this user' });
        }
        
        trainer.pokemons.push(pokemon);
      }
  
      await trainer.save();
      res.json({ message: 'Pokemon added successfully' });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.put('/api/users/:pokemonOwnerName/pokemon/:pokemonName', async (req, res) => {
    const { pokemonOwnerName, pokemonName } = req.params;
    const { newTrainerName, ...updatedPokemonData } = req.body;
  
    try {
      // Find the trainer by their name
      let trainer = await Trainer.findOne({ pokemonOwnerName });
  
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
  
      // Find the specific Pokemon by its name within the trainer's collection
      let pokemon = trainer.pokemons.find(p => p.pokemonName === pokemonName);
  
      if (!pokemon) {
        return res.status(404).json({ message: 'Pokemon not found' });
      }
  
      // Update the Pokemon's details
      pokemon.pokemonAbility = updatedPokemonData.pokemonAbility || pokemon.pokemonAbility;
      pokemon.initialPositionX = updatedPokemonData.initialPositionX || pokemon.initialPositionX;
      pokemon.initialPositionY = updatedPokemonData.initialPositionY || pokemon.initialPositionY;
      pokemon.speed = updatedPokemonData.speed || pokemon.speed;
      pokemon.direction = updatedPokemonData.direction || pokemon.direction;
  
      // Update the trainer's name if provided
      if (newTrainerName) {
        trainer.pokemonOwnerName = newTrainerName;
      }
  
      // Save the updated trainer document
      await trainer.save();
      res.json({ message: 'Pokemon and trainer updated successfully' });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.delete('/api/users/:pokemonOwnerName', async (req, res) => {
    const { pokemonOwnerName } = req.params;
  
    try {
      const result = await Trainer.findOneAndDelete({ pokemonOwnerName });
  
      if (!result) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
  
      res.json({ message: 'Trainer deleted successfully' });
    } catch (error) {
      res.status(500).send(error);
    }
  });
    

app.listen(4000, () => {
  console.log('Server is running on port 5000');
});
