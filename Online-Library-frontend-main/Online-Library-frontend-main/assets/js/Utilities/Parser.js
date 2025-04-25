import {validator} from "./Validator.js"

export function TryParseData(inputs){
    let BookResult = {
        "id" : "",
        "name" : "",
        "author" : "",
        "description" : "",
        "category" : ""
    };
    
    let counter = 0;
    for (let i in BookResult){
        for (let j in inputs){
            if (!inputs[j] || typeof inputs[j].id !== 'string') continue;
            let S = inputs[j].id.toLowerCase();
            if (S.includes(i)){
                counter++;
                BookResult[i] = inputs[j].value;
            }
        }
    }
    if (counter !== 5) return undefined;
    
    if (!(validator.ValidateID(BookResult["id"])
        && validator.ValidateCategories(BookResult["category"]))){
        return undefined;
    }

    
    return BookResult;
}



