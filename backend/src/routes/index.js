import knex from "knex";
import knexfile from "../../knexfile.js";
import dotenv from "dotenv";
import {generateEmail} from "../utils/openai.js";

// Load environment variables from .env file
dotenv.config();

const db = knex(knexfile.development);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function routes(fastify, options) {
    fastify.get('/ping', async (request, reply) => {
        return 'pong\n';
    });

    fastify.get('/emails', async (request, reply) => {
        const {limit = 10, offset = 0} = request.query;
        try {
            const emails = await db.select('*').from('emails').limit(limit).offset(offset);
            return {emails};
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    fastify.get('/emails/:id', async (request, reply) => {
        const {id} = request.params;
        try {
            const email = await db('emails').where('id', id).first();
            if (!email) {
                return reply.status(404).send({error: 'Email not found'});
            }
            return {email};
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    fastify.post('/generate-email', async (req, reply) => {
        const {prompt, original_email, classification} = req.body;
        console.log('OpenAI API key loaded:', OPENAI_API_KEY ? 'Yes' : 'No');

        if (!OPENAI_API_KEY) {
            return reply.status(500).send({
                error: 'OpenAI API key not configured',
                details: 'Please set OPENAI_API_KEY environment variable'
            });
        }

        // Determine classification based on whether this is a reply or new email
        let emailClassification = 'sales'; // Default to sales for new emails
        
        // If there's original email context, it's a follow-up
        if (original_email) {
            emailClassification = 'follow-up';
        }
        
        try {
            const result = await generateEmail({
                apiKey: OPENAI_API_KEY,
                prompt,
                classification: emailClassification,
                originalEmail: original_email
            });

            return result;
        } catch (error) {
            console.error('Email generation error:', error);

            if (error.message.includes('quota') || error.message.includes('429')) {
                // Fallback response when quota is exceeded
                let fallbackSubject = parsedEmail.subject || 'Generated Email';
                let fallbackBody = prompt;

                // If this is a reply, extract subject from original email
                if (original_email) {
                    try {
                        const parsedEmail = typeof original_email === 'string' ? JSON.parse(original_email) : original_email;
                        fallbackSubject = `Re: ${parsedEmail.subject}`;
                        fallbackBody = `${prompt}\n\n--- Original Message ---\nFrom: ${parsedEmail.to}\nSubject: ${parsedEmail.subject}\n\n${parsedEmail.body}`;
                    } catch (parseError) {
                        console.error('Error parsing original email for fallback:', parseError);
                        fallbackSubject = 'Re: Previous Email';
                        fallbackBody = `${prompt}`;
                    }
                }
                console.log('Fallback email, due to quota exceeded');

                return reply.status(200).send({
                    subject: fallbackSubject,
                    body: fallbackBody,
                });
                // return reply.status(429).send({
                //     error: 'OpenAI quota exceeded. Please check your billing or try again later.',
                //     details: error.message
                // });
            }

            if (error.message.includes('401') || error.message.includes('invalid')) {
                return reply.status(401).send({
                    error: 'Invalid OpenAI API key. Please check your configuration.',
                    details: error.message
                });
            }

            return reply.status(500).send({
                error: 'Failed to generate email',
                details: error.message
            });
        }
    });

    fastify.post('/send-email', async (req, reply) => {
        const {to, cc, bcc, subject, body} = req.body;

        // Validate required fields
        if (!to || !subject || !body) {
            return reply.status(400).send({
                error: 'Missing required fields: to, subject, and body are required'
            });
        }

        try {
            // Save email to database
            const [emailId] = await db('emails').insert({
                to,
                cc: cc || null,
                bcc: bcc || null,
                subject,
                body,
                created_at: new Date(),
                updated_at: new Date()
            });

            // Return success response with the saved email data
            const savedEmail = await db('emails').where('id', emailId).first();

            return {
                success: true,
                message: 'Email saved successfully',
                email: savedEmail
            };
        } catch (error) {
            reply.status(500).send({
                error: 'Failed to save email',
                details: error.message
            });
        }
    });

}
