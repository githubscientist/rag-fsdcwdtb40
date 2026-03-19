# RAG System Powered Application

This repository contains a Retrieval-Augmented Generation (RAG) system that integrates with vector database(created at mongodb.com) to enhance the capabilities of language models by providing them with relevant information from a large corpus of data. The RAG system allows for more accurate and context-aware responses by retrieving relevant documents from the vector database and using them to generate responses.

## Features

- **Vector Database Integration**: The system connects to a vector database to store and retrieve document embeddings, enabling efficient retrieval of relevant information.

- **Retrieval-Augmented Generation**: The RAG system retrieves relevant documents based on the input query and uses them to generate more accurate and context-aware responses.

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB (Vector Database)
- Language Model: OpenAI GPT-nano

## API Endpoints

POST /api/embed-docs

- Description: Embeds documents and stores them in the vector database.
- Request Body: An array of documents to be embedded.
- Response: Success message with the number of documents embedded.

POST /api/ask

- Description: Retrieves relevant documents based on the input query and generates a response using the language model.
- Request Body: A query string.
- Response: Generated response based on the retrieved documents.
