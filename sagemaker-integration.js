// SageMaker Integration Module
// Add this to your existing frontend project

import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

class SageMakerPredictor {
    constructor(endpointName, region = "us-west-2") {
        this.endpointName = endpointName;
        this.client = new SageMakerRuntimeClient({
            region: region,
            credentials: {
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY"
            }
        });
    }

    async predict(features) {
        try {
            // Convert features to numpy array format
            const numpyData = new Float32Array(features);
            
            const command = new InvokeEndpointCommand({
                EndpointName: this.endpointName,
                ContentType: "application/x-npy",
                Body: numpyData.buffer
            });

            const response = await this.client.send(command);
            
            // Parse the response (numpy format)
            const prediction = new Float32Array(response.Body);
            return prediction[0]; // Assuming single prediction
        } catch (error) {
            console.error("Error calling SageMaker:", error);
            throw error;
        }
    }
}

// Usage example for React/Vue/vanilla JS
export const useSageMaker = (endpointName) => {
    const predictor = new SageMakerPredictor(endpointName);
    
    return {
        predict: predictor.predict.bind(predictor)
    };
};

// For React Hook
export const useSageMakerReact = (endpointName) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const predictor = React.useMemo(() => new SageMakerPredictor(endpointName), [endpointName]);

    const predict = React.useCallback(async (features) => {
        setLoading(true);
        setError(null);
        try {
            const result = await predictor.predict(features);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    }, [predictor]);

    return { predict, loading, error };
}; 