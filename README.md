# Simple PyTorch Model for SageMaker Deployment

This project demonstrates how to create, train, and deploy a simple PyTorch neural network model to AWS SageMaker.

## Project Structure

```
├── simple_model.py              # Model training script
├── simple_inference/
│   └── code/
│       ├── inference.py         # SageMaker inference functions
│       └── requirements.txt     # Inference dependencies
├── test_simple_inference.py     # Local testing script
├── deploy_to_sagemaker.py       # SageMaker deployment script
├── requirements.txt             # Main project dependencies
└── README.md                   # This file
```

## Model Architecture

The simple model consists of:
- **Input Layer**: 10 features
- **Hidden Layer 1**: 64 neurons with ReLU activation
- **Hidden Layer 2**: 32 neurons with ReLU activation  
- **Output Layer**: 1 neuron (regression)
- **Dropout**: 20% dropout for regularization

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python simple_model.py
```

This will:
- Train a simple neural network on synthetic data
- Save the model to `./model/model.pth`
- Save model configuration to `./model/model_config.json`

### 3. Test Locally

```bash
python test_simple_inference.py
```

This tests all SageMaker inference functions locally:
- `model_fn`: Loads the trained model
- `input_fn`: Deserializes JSON input
- `predict_fn`: Generates predictions
- `output_fn`: Serializes predictions to JSON

### 4. Deploy to SageMaker

```bash
python deploy_to_sagemaker.py
```

**Prerequisites:**
- AWS credentials configured (`aws configure`)
- SageMaker permissions
- S3 permissions

## SageMaker Inference Functions

### `model_fn(model_dir)`
- Loads the PyTorch model from the model directory
- Reads model configuration from `model_config.json`
- Returns the loaded model

### `input_fn(request_body, request_content_type)`
- Deserializes JSON input data
- Supports `application/json` content type
- Returns the deserialized data dictionary

### `predict_fn(input_data, model)`
- Takes input features and the loaded model
- Converts input to PyTorch tensors
- Generates predictions
- Returns prediction results

### `output_fn(prediction, content_type)`
- Serializes prediction results to JSON
- Supports `application/json` content type
- Returns JSON string

## Input Format

The model expects input in JSON format:

```json
{
    "features": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
}
```

## Output Format

The model returns predictions in JSON format:

```json
{
    "predictions": [0.123456]
}
```

## Customization

### Modify Model Architecture

Edit `simple_model.py` to change:
- Input size (`input_size`)
- Hidden layer sizes (`hidden_size`)
- Output size (`output_size`)
- Number of layers
- Activation functions

### Modify Training Data

Edit the `SimpleDataset` class in `simple_model.py` to:
- Use your own dataset
- Change the number of samples
- Modify the target calculation

### Modify Inference Logic

Edit `simple_inference/code/inference.py` to:
- Change input preprocessing
- Modify prediction post-processing
- Add custom validation

## Deployment Options

### 1. SageMaker Endpoint
- Real-time inference
- Auto-scaling capabilities
- Pay per request

### 2. SageMaker Batch Transform
- Batch processing
- Cost-effective for large datasets
- No persistent endpoint

### 3. SageMaker Real-time Inference
- Low latency
- Single model instance
- Predictable costs

## Monitoring and Logging

The inference code includes comprehensive logging:
- Model loading status
- Input deserialization
- Prediction generation
- Output serialization

## Troubleshooting

### Common Issues

1. **Model not found**: Run `python simple_model.py` first
2. **AWS credentials**: Configure with `aws configure`
3. **Permissions**: Ensure SageMaker and S3 permissions
4. **Memory issues**: Reduce model size or use larger instance

### Debug Mode

Enable detailed logging by modifying the logging level in `inference.py`:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Cost Optimization

- Use appropriate instance types (`ml.m5.large` for testing)
- Enable auto-scaling for production
- Consider batch processing for large datasets
- Monitor CloudWatch metrics

## Security Best Practices

- Use IAM roles with minimal permissions
- Enable VPC for network isolation
- Encrypt model artifacts in S3
- Monitor access logs

## Next Steps

1. **Customize the model** for your specific use case
2. **Add data preprocessing** in the inference pipeline
3. **Implement model versioning** for A/B testing
4. **Add monitoring and alerting** for production deployment
5. **Implement CI/CD pipeline** for automated deployment

## Support

For issues and questions:
1. Check the AWS SageMaker documentation
2. Review the PyTorch documentation
3. Check AWS CloudWatch logs for deployment issues 