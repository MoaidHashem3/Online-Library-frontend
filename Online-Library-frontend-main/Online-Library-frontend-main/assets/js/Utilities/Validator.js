


const Categories = ["Horror","Funny","Romantic","IDK"];


export const validator = {
    ValidateID : (Id) => {
        return Id !== "" && !isNaN(Number(Id));
    },

    ValidateCategories: (C) => {
        return Categories.includes(C);
    }
}
