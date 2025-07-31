from inference.code.inference import input_fn, output_fn, model_fn, predict_fn
import json

# Convert the dictionary to a JSON string
sample_json_string = json.dumps({
    "src": "This is a sample text to be translated.",
    "mt": "Dies ist ein zu übersetzender Beispieltext."
})

model_dir = './inference/'

# Test input_fn
deserialized_data = input_fn(sample_json_string, 'application/json')
print(f"Deserialized Data: {deserialized_data}")

# Test model_fn
model = model_fn(model_dir)
print("Model loaded successfully")

# Test predict_fn
prediction = predict_fn(deserialized_data, model)
print(f"Prediction: {prediction}")

# Test output_fn
serialized_data = output_fn(prediction, 'application/json')
print(f"Serialized Data: {serialized_data}")

print(f"type: {type(serialized_data)}")