class Menu {
    meals = []
    constructor() {
        this.date = Date()
    }
    addMeal(mealString) {
        this.meals.push(mealString)
    }
    getMeals(){
        let resultString = ""
        this.meals.forEach(e=>{
            resultString += e + "\n"
        })
        return resultString
    }
}
class MenuItem {
    constructor(name, portion, calories){
        
    }
}


module.exports = { Menu }