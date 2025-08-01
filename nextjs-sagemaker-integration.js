// Next.js SageMaker Integration
// Add this to your Next.js project

import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

// For client-side usage (in components)
export async function predictWithSageMaker(features, endpointName) {
    const client = new SageMakerRuntimeClient({
        region: "us-west-2",
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
        }
    });

    try {
        // Convert features to numpy array format
        const numpyData = new Float32Array(features);
        
        const command = new InvokeEndpointCommand({
            EndpointName: endpointName,
            ContentType: "application/x-npy",
            Body: numpyData.buffer
        });

        const response = await client.send(command);
        
        // Parse the response
        const prediction = new Float32Array(response.Body);
        return prediction[0];
    } catch (error) {
        console.error("Error calling SageMaker:", error);
        throw error;
    }
}

// For server-side usage (in API routes)
export async function predictWithSageMakerServer(features, endpointName) {
    const client = new SageMakerRuntimeClient({
        region: "us-west-2",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    try {
        const numpyData = new Float32Array(features);
        
        const command = new InvokeEndpointCommand({
            EndpointName: endpointName,
            ContentType: "application/x-npy",
            Body: numpyData.buffer
        });

        const response = await client.send(command);
        const prediction = new Float32Array(response.Body);
        return prediction[0];
    } catch (error) {
        console.error("Error calling SageMaker:", error);
        throw error;
    }
} 