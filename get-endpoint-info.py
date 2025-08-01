#!/usr/bin/env python3
"""
Script to get SageMaker endpoint information
"""

import boto3
import json

def get_endpoint_info():
    """Get information about deployed SageMaker endpoints"""
    
    # Create SageMaker client
    sagemaker = boto3.client('sagemaker', region_name='us-west-2')
    
    try:
        # List all endpoints
        response = sagemaker.list_endpoints()
        
        print("Deployed SageMaker Endpoints:")
        print("=" * 50)
        
        for endpoint in response['Endpoints']:
            print(f"Endpoint Name: {endpoint['EndpointName']}")
            print(f"Status: {endpoint['EndpointStatus']}")
            print(f"Created: {endpoint['CreationTime']}")
            print(f"Last Modified: {endpoint['LastModifiedTime']}")
            print("-" * 30)
            
        return response['Endpoints']
        
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    get_endpoint_info() 