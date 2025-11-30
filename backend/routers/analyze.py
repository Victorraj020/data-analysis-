from fastapi import APIRouter, UploadFile, File, HTTPException
from services.analysis import analyze_data
import pandas as pd
import io

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel.")
    
    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # Basic analysis
        result = analyze_data(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
