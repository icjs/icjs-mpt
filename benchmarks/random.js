'use strict'
const Trie = require('../')
const ircUtil = require('icjs-util')
const async = require('async')

const ROUNDS = 1000
const SYMMETRIC = true
const ERA_SIZE = 1000

let trie = new Trie()
let seed = Buffer.alloc(32).fill(0)

let testName = 'rounds ' + ROUNDS + ' ' + ERA_SIZE + ' ' + SYMMETRIC ? 'sys' : 'rand'
console.time(testName)
run(() => {
  console.timeEnd(testName)
})

function run (cb) {
  let i = 0
  async.whilst(
    () => {
      i++
      return i <= ROUNDS
    },
    function (done) {
      seed = ircUtil.sha3(seed)
      if (SYMMETRIC) {
        trie.put(seed, seed, genRoot)
      } else {
        let val = ircUtil.sha3(seed)
        trie.put(seed, val, genRoot)
      }

      function genRoot () {
        if (i % ERA_SIZE === 0) {
          seed = trie.root
        }
        done()
      }
    }, cb
  )
}
