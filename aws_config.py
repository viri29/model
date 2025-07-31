# AWS Configuration for SageMaker Deployment
# Update these values after running setup_aws_permissions.sh

# Your AWS Account ID (run: aws sts get-caller-identity --query Account --output text)
AWS_ACCOUNT_ID = None

# Your AWS Region (run: aws configure get region)
AWS_REGION = None

# S3 Bucket name (provided by setup_aws_permissions.sh)
S3_BUCKET_NAME = None

# SageMaker Execution Role ARN (provided by setup_aws_permissions.sh)
SAGEMAKER_ROLE_ARN = None

# SageMaker Instance Type for deployment
SAGEMAKER_INSTANCE_TYPE = "ml.m5.large"

# Number of instances for the endpoint
SAGEMAKER_INSTANCE_COUNT = 1

# Example configuration (replace with your actual values):
# AWS_ACCOUNT_ID = "123456789012"
# AWS_REGION = "us-east-1"
# S3_BUCKET_NAME = "sagemaker-model-bucket-1234567890"
# SAGEMAKER_ROLE_ARN = "arn:aws:iam::123456789012:role/SageMakerExecutionRole" 