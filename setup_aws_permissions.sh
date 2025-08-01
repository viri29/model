#!/bin/bash

# AWS Permissions Setup Script for SageMaker Deployment
# This script creates the necessary IAM roles and S3 bucket for SageMaker deployment

set -e  # Exit on any error

echo "🔧 Setting up AWS permissions for SageMaker deployment..."
echo "=================================================="

# Get AWS account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Error: Could not get AWS account ID. Please check your AWS credentials."
    exit 1
fi

if [ -z "$REGION" ]; then
    echo "❌ Error: Could not get AWS region. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS Account ID: $ACCOUNT_ID"
echo "✅ AWS Region: $REGION"

# Create unique bucket name
BUCKET_NAME="sagemaker-model-bucket-$(date +%s)"
ROLE_NAME="SageMakerExecutionRole"

echo ""
echo "📦 Creating S3 bucket: $BUCKET_NAME"

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Set bucket policy for SageMaker access
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
        {
            \"Sid\": \"SageMakerAccess\",
            \"Effect\": \"Allow\",
            \"Principal\": {
                \"Service\": \"sagemaker.amazonaws.com\"
            },
            \"Action\": [
                \"s3:GetObject\",
                \"s3:PutObject\",
                \"s3:DeleteObject\",
                \"s3:ListBucket\"
            ],
            \"Resource\": [
                \"arn:aws:s3:::$BUCKET_NAME\",
                \"arn:aws:s3:::$BUCKET_NAME/*\"
            ]
        }
    ]
}"

echo "✅ S3 bucket created and configured"

echo ""
echo "👤 Creating SageMaker execution role: $ROLE_NAME"

# Create trust policy file
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "sagemaker.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

# Create the role
aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json

# Attach SageMaker execution policy
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonSageMakerFullAccess

# Attach S3 read policy
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# Clean up trust policy file
rm trust-policy.json

echo "✅ SageMaker execution role created"

echo ""
echo "🔍 Testing permissions..."

# Test S3 access
echo "Testing S3 access..."
aws s3 ls s3://$BUCKET_NAME

# Test SageMaker access
echo "Testing SageMaker access..."
aws sagemaker list-models --max-items 1

echo "✅ All permissions tests passed!"

echo ""
echo "🎉 Setup complete!"
echo "=================================================="
echo "📋 Configuration Summary:"
echo "   AWS Account ID: $ACCOUNT_ID"
echo "   AWS Region: $REGION"
echo "   S3 Bucket: $BUCKET_NAME"
echo "   IAM Role: $ROLE_NAME"
echo "   Role ARN: arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"
echo ""
echo "📝 Next steps:"
echo "   1. Update deploy_to_sagemaker.py with your bucket name: $BUCKET_NAME"
echo "   2. Run: python3 deploy_to_sagemaker.py"
echo ""
echo "💡 To clean up later:"
echo "   aws s3 rb s3://$BUCKET_NAME --force"
echo "   aws iam delete-role --role-name $ROLE_NAME" 