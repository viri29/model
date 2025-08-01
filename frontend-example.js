// Frontend JavaScript example for connecting to SageMaker endpoint
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

// Configure AWS credentials (you'll need to set these up)
const client = new SageMakerRuntimeClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY"
  }
});

async function predictFromSageMaker(features) {
  try {
    // Convert features to numpy array format
    const numpyData = new Float32Array(features);
    
    const command = new InvokeEndpointCommand({
      EndpointName: "YOUR_ENDPOINT_NAME", // Replace with your actual endpoint name
      ContentType: "application/x-npy",
      Body: numpyData.buffer
    });

    const response = await client.send(command);
    
    // Parse the response (numpy format)
    const prediction = new Float32Array(response.Body);
    return prediction[0]; // Assuming single prediction
  } catch (error) {
    console.error("Error calling SageMaker:", error);
    throw error;
  }
}

// Example usage
const features = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
predictFromSageMaker(features)
  .then(prediction => console.log("Prediction:", prediction))
  .catch(error => console.error("Error:", error)); 