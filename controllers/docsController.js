const OpenAI = require('openai');
const Doc = require('../models/doc');
const { OPENAI_API_KEY } = require('../utils/config');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// our knowledge base -- is used for the context of the RAG system
// const rawDocuments = [
//     'In common usage, the fastest animal usually refers to the fastest land animal.',
//     'Peregrine Falcon is the fastest animal in the air',
//     'Sailfish is the fastest animal in the water',
//     'The fastest animal can vary by environment such as land, air or water.'
// ];

async function getEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    });

    return response.data[0].embedding;
}

async function seedDocuments(documents) {
    const docsToInsert = [];

    for (const text of documents) {
        const embedding = await getEmbedding(text);

        docsToInsert.push({
            text,
            embedding
        });
    }

    const insertResult = await Doc.insertMany(docsToInsert);
    return insertResult;
}

function similarity(v1, v2) {
    let sum = 0;

    for (let i = 0; i < v1.length; i++) {
        sum += v1[i] * v2[i];
    }

    return sum;
}

const docsController = {
    seedDocs: async (req, res) => {
        try {
            // get the document from the request body
            const { documents } = req.body;

            const insertResult = await seedDocuments(documents);

            return res.status(200).json({ message: 'documents embedded and stored successfully', data: insertResult });
        } catch (error) {
            return res.status(500).json({ message: 'failed to embed documents', error: error.message })
        }
    },
    askQuestion: async (req, res) => {
        try {
            // get the question from the request body
            const { question } = req.body;

            // get the embedding for the question
            const questionEmbedding = await getEmbedding(question);

            // get all the documents from the database
            const docs = await Doc.find();

            // compute the similarity scores
            const scores = docs.map(doc => {
                const score = similarity(questionEmbedding, doc.embedding);

                return {
                    text: doc.text,
                    score,
                };
            });

            // sort the similarity scores in descending order
            scores.sort((a, b) => b.score - a.score);

            // return the top 1
            const topDoc = scores.slice(0, 3);

            // build context
            const context = topDoc
                .map((doc, i) => `Document ${i + 1}: ${doc.text}`)
                .join('\n');

            // create a prompt
            const prompt = `You are a helpful assistant. Answer using ONLY the context below.
            Rules:
            1. If question is general -> use common usage
            2. If air -> Falcon
            3. If water -> Sailfish
            4. Keep answer short.
            
            Context: ${context}
            Question: ${question}`;

            // send the prompt to the LLM
            const response = await openai.responses.create({
                model: 'gpt-5-nano',
                input: prompt,
            });

            return res.status(200).json({ question, topDoc, answer: response.output_text });
        } catch (error) {
            return res.status(500).json({ message: 'failed to process the question', error: error.message })
        }
    }
}

module.exports = docsController;