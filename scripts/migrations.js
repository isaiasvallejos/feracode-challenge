#!/usr/bin/env node

import {
  destroyDatabase,
  createDatabase,
  createConnectionAsDefault
} from 'vendor/couchdb/connection'

import { argv } from 'yargs'

const connection = createConnectionAsDefault()

if (argv.up) {
  createDatabase(process.env.COUCHDB_DATABASE, connection).then(() =>
    process.exit()
  )
}

if (argv.down) {
  destroyDatabase(process.env.COUCHDB_DATABASE, connection)
    .then(() => process.exit()) // prettier-ignore
}
