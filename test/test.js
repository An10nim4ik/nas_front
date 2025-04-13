const personOne = {
    name: 'Bob',
    age: 20
}

function increasePersonAge(person) {
    person.age += 1
    return person
}

increasePersonAge(personOne)
console.log(personOne.age)