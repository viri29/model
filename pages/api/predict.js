// pages/api/predict.js
// Next.js API route for SageMaker predictions

import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { features } = req.body;
        
        if (!features || !Array.isArray(features) || features.length !== 10) {
            return res.status(400).json({ error: 'Features must be an array of 10 numbers' });
        }

        const client = new SageMakerRuntimeClient({
            region: "us-west-2",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        // Convert features to numpy array format
        const numpyData = new Float32Array(features);
        
        const command = new InvokeEndpointCommand({
            EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME, // Set this in your .env.local
            ContentType: "application/x-npy",
            Body: numpyData.buffer
        });

        const response = await client.send(command);
        
        // Parse the response
        const prediction = new Float32Array(response.Body);
        
        res.status(200).json({ 
            prediction: prediction[0],
            features: features 
        });

    } catch (error) {
        console.error('SageMaker prediction error:', error);
        res.status(500).json({ 
            error: 'Failed to get prediction',
            details: error.message 
        });
    }
} 