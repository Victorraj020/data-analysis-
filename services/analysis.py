import pandas as pd
import json

def analyze_data(df: pd.DataFrame):
    # Basic statistics
    description = df.describe().to_dict()
    
    # Missing values
    missing_values = df.isnull().sum().to_dict()
    
    # Column types
    dtypes = df.dtypes.apply(lambda x: str(x)).to_dict()
    
    # Preview (first 5 rows)
    preview = df.head().to_dict(orient='records')
    
    return {
        "description": description,
        "missing_values": missing_values,
        "dtypes": dtypes,
        "preview": preview,
        "columns": list(df.columns),
        "shape": df.shape
    }
