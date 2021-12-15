import bcrypt from "bcrypt"

const plainPW = "abc123"

const numberOfRounds = 10 // The algorithm will be executed 2^10 = 1024 times

console.log("Number of Rounds: ", numberOfRounds)
console.time("hashing")
const hash = bcrypt.hashSync(plainPW, numberOfRounds)
console.timeEnd("hashing")

console.log("HASH: ", hash)
const isOK = bcrypt.compareSync("abc123", "$2b$10$SRTGSdWmb9pjeCTQppvyQ.eOoPcZUV29gWkFTs3FpevnLqCLYmIw.") // hash("MEaSo7rvkoOguF3TfOq.u.oO" + "abc") --> compare two hashes --> yes or no

console.log("Do they match? ", isOK)