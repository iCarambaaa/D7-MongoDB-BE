import jwt from "jsonwebtoken"

const token = jwt.sign({ _id: "12oij3o12ij32o1j321j3o1" }, "mysup3rscr3t", { expiresIn: "10s" })

console.log(token)

const decoded = jwt.verify(token, "mysup3rscr3t")

console.log(decoded)
