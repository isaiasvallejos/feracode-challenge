#!/usr/bin/env node

import {
  destroyDatabase,
  createDatabase,
  createConnectionAsDefault
} from 'vendor/couchdb/connection'

import { argv } from 'yargs'
import createDatabaseDesigns from 'database/design'

const connection = createConnectionAsDefault()

const down = () =>
  destroyDatabase(process.env.COUCHDB_DATABASE, connection).then(() =>
    process.exit()
  )

const up = () =>
  createDatabase(process.env.COUCHDB_DATABASE, connection)
    .then(createDatabaseDesigns)
    .catch(down)

if (argv.up) {
  up()
}

if (argv.down) {
  down()
}
