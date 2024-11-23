common_weights = {
    "inbreeding_coefficient": 2.0,
    "health_score": 1.5,
    "body_condition": 1.2,
    "age": 1.0,
    "fertility_percentage": 1.7,
    "genetic_value": 1.4
}

direction_weights = {
    'milk': {
        'milk_yield_day': 2.0,
        'weight_gain_day': 1.0
    },
    'meat': {
        'milk_yield_day': 1.0,
        'weight_gain_day': 2.0
    },
    'combined': {
        'milk_yield_day': 1.5,
        'weight_gain_day': 1.5
    },

}