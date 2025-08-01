import json
import boto3
import numpy as np
import io
import base64

def lambda_handler(event, context):
    """Lambda function to proxy requests to SageMaker endpoint"""
    
    # SageMaker client
    runtime = boto3.client('sagemaker-runtime')
    
    # Your endpoint name
    endpoint_name = "YOUR_ENDPOINT_NAME"  # Replace with your actual endpoint name
    
    try:
        # Parse input from API Gateway
        body = json.loads(event['body'])
        features = body.get('features', [])
        
        # Convert to numpy array
        features_array = np.array(features, dtype=np.float32)
        
        # Convert to bytes for SageMaker
        buffer = io.BytesIO()
        np.save(buffer, features_array)
        buffer.seek(0)
        
        # Call SageMaker endpoint
        response = runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/x-npy',
            Body=buffer.getvalue()
        )
        
        # Parse response
        result = np.load(io.BytesIO(response['Body'].read()))
        prediction = result.tolist()
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'prediction': prediction
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': str(e)
            })
        } 