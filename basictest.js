let x = `\"heaylo \\n Ich haube gayyy\"`
let map = {
    "\\n" : "\n",
}
let s = map[x]
console.log(s)