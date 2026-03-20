require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rag-fsdcwdtb40';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = {
    PORT,
    MONGODB_URI,
    OPENAI_API_KEY
}