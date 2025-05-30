import json
from pathlib import Path

def clean_income_data():
    script_dir = Path(__file__).parent
    input_file = script_dir.parent / "client" / "public" / "orange_county_blockgroups_with_income.geojson"
    output_file = script_dir.parent / "client" / "public" / "orange_county_blockgroups_with_income_cleaned.geojson"
    
    print("Starting data cleaning process...")
    
    try:
        print("Reading original file...")
        with open(input_file, 'r', encoding='utf-8') as f:
            geojson_data = json.load(f)
        
        original_count = len(geojson_data['features'])
        print(f"Original features count: {original_count}")
        
        cleaned_features = []
        
        for feature in geojson_data['features']:
            income = feature['properties'].get('ACSDT5Y2023.B19013-Data_B19013_001E')
            
            is_valid = (
                income is not None and
                income != "-" and
                income != "" and
                income != "null" and
                str(income).strip() != "" and
                str(income).strip() != "-"
            )

            if is_valid:
                try:
                    income_float = float(income)
                    if income_float > 0:  
                        cleaned_features.append(feature)
                except (ValueError, TypeError):
                    continue
        
        cleaned_count = len(cleaned_features)
        removed_count = original_count - cleaned_count
        
        print(f"Cleaned features count: {cleaned_count}")
        print(f"Removed {removed_count} features with invalid income data")
        
        cleaned_geojson = {
            **geojson_data,
            'features': cleaned_features
        }
        
        print("Writing cleaned file...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_geojson, f, indent=2)
        
        print(f"✅ Cleaning complete! Cleaned file saved as: {output_file}")
        
        reduction_percentage = (removed_count / original_count * 100) if original_count > 0 else 0
        print(f"📊 Data reduction: {reduction_percentage:.1f}% of entries removed")
        
    except FileNotFoundError:
        print(f"❌ Error: Could not find input file: {input_file}")
    except json.JSONDecodeError:
        print("❌ Error: Invalid JSON format in input file")
    except Exception as e:
        print(f"❌ Error cleaning data: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    success = clean_income_data()
    if not success:
        exit(1) 