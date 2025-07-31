import boto3
import sagemaker
from sagemaker.pytorch import PyTorchModel
from sagemaker import get_execution_role
import os
import zipfile
import shutil

def create_model_archive():
    """Create a zip file containing the model artifacts for SageMaker"""
    
    # Create a temporary directory for the model artifacts
    model_artifacts_dir = 'model_artifacts'
    os.makedirs(model_artifacts_dir, exist_ok=True)
    
    # Copy the inference code
    shutil.copytree('simple_inference', os.path.join(model_artifacts_dir, 'simple_inference'))
    
    # Copy the trained model
    if os.path.exists('./model'):
        shutil.copytree('./model', os.path.join(model_artifacts_dir, 'model'))
    else:
        print("Warning: Model directory not found. Please run 'python simple_model.py' first.")
        return None
    
    # Create zip file
    zip_filename = 'model_artifacts.zip'
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(model_artifacts_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, model_artifacts_dir)
                zipf.write(file_path, arcname)
    
    # Clean up temporary directory
    shutil.rmtree(model_artifacts_dir)
    
    print(f"Model artifacts created: {zip_filename}")
    return zip_filename

def deploy_to_sagemaker(model_artifacts_path, role_arn=None):
    """Deploy the model to SageMaker"""
    
    # Initialize SageMaker session
    session = sagemaker.Session()
    
    # Get the default role if not provided
    if role_arn is None:
        try:
            role_arn = get_execution_role()
        except:
            print("Error: Could not get execution role. Please provide a valid IAM role ARN.")
            return None
    
    print(f"Using IAM role: {role_arn}")
    
    # Upload model artifacts to S3
    model_data = session.upload_data(
        path=model_artifacts_path,
        bucket=session.default_bucket(),
        key_prefix='simple-pytorch-model'
    )
    
    print(f"Model artifacts uploaded to S3: {model_data}")
    
    # Create PyTorch model
    pytorch_model = PyTorchModel(
        model_data=model_data,
        role=role_arn,
        entry_point='inference.py',
        source_dir='simple_inference/code',
        framework_version='1.9.0',
        py_version='py38'
    )
    
    # Deploy the model
    print("Deploying model to SageMaker...")
    predictor = pytorch_model.deploy(
        initial_instance_count=1,
        instance_type='ml.m5.large'
    )
    
    print(f"Model deployed successfully!")
    print(f"Endpoint name: {predictor.endpoint_name}")
    
    return predictor

def test_endpoint(predictor):
    """Test the deployed endpoint"""
    
    # Sample input data
    sample_features = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    
    # Create input data
    input_data = {
        "features": sample_features
    }
    
    print("\nTesting deployed endpoint...")
    print(f"Input: {input_data}")
    
    # Make prediction
    prediction = predictor.predict(input_data)
    print(f"Prediction: {prediction}")
    
    return prediction

def main():
    """Main function to train, package, and deploy the model"""
    
    print("Simple PyTorch Model - SageMaker Deployment")
    print("=" * 50)
    
    # Step 1: Train the model (if not already trained)
    if not os.path.exists('./model/model.pth'):
        print("\n1. Training model...")
        from simple_model import train_model
        train_model()
    else:
        print("\n1. Model already exists, skipping training...")
    
    # Step 2: Create model artifacts
    print("\n2. Creating model artifacts...")
    model_artifacts_path = create_model_archive()
    if model_artifacts_path is None:
        print("Failed to create model artifacts. Exiting.")
        return
    
    # Step 3: Deploy to SageMaker
    print("\n3. Deploying to SageMaker...")
    print("Note: This requires AWS credentials and appropriate permissions.")
    print("Make sure you have:")
    print("- AWS credentials configured")
    print("- SageMaker permissions")
    print("- S3 permissions")
    
    # Uncomment the following lines to actually deploy
    # predictor = deploy_to_sagemaker(model_artifacts_path)
    # if predictor:
    #     test_endpoint(predictor)
    
    print("\nDeployment script ready!")
    print("To deploy, uncomment the deployment lines in the script.")

if __name__ == "__main__":
    main() 